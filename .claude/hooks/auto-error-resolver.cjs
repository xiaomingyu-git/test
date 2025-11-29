#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class TypeScriptErrorResolver {
    constructor(projectDir) {
        this.projectDir = projectDir;
        this.fixesApplied = [];
        this.errorsDetected = [];
    }

    /**
     * 检测并修复 TypeScript 错误
     */
    async resolveErrors() {
        console.error('🔍 开始检测 TypeScript 错误...');

        try {
            // 1. 获取 TypeScript 诊断信息
            const diagnostics = await this.getTypeScriptDiagnostics();

            if (diagnostics.length === 0) {
                console.error('✅ 未发现 TypeScript 错误');
                return { success: true, fixesApplied: [], errorsDetected: [] };
            }

            console.error(`📊 检测到 ${diagnostics.length} 个 TypeScript 错误`);
            this.errorsDetected = diagnostics;

            // 2. 分析错误类型并应用修复
            await this.analyzeAndFixErrors(diagnostics);

            // 3. 验证修复结果
            const verificationResult = await this.verifyFixes();

            return {
                success: verificationResult.success,
                fixesApplied: this.fixesApplied,
                errorsDetected: this.errorsDetected,
                remainingErrors: verificationResult.remainingErrors
            };

        } catch (error) {
            console.error('❌ 错误修复过程中发生异常:', error.message);
            return {
                success: false,
                error: error.message,
                fixesApplied: this.fixesApplied,
                errorsDetected: this.errorsDetected
            };
        }
    }

    /**
     * 获取 TypeScript 诊断信息
     */
    async getTypeScriptDiagnostics() {
        return new Promise((resolve) => {
            const tscCmd = 'npx vue-tsc --noEmit --project tsconfig.app.json --pretty false 2>&1';

            exec(tscCmd, { cwd: this.projectDir }, (error, stdout, stderr) => {
                const diagnostics = [];

                // TypeScript 错误输出可能在 stdout 或 stderr 中
                const output = (stdout || '') + (stderr || '');

                // 解析 TypeScript 输出
                if (output) {
                    const lines = output.split('\n').map(line => line.trim()).filter(line => line);

                    for (const line of lines) {
                        // 解析错误行格式: file(line,column): error TSxxxx: message
                        const match = line.match(/^([^(]+)\((\d+),(\d+)\):\s*error\s+TS(\d+):\s*(.+)$/);
                        if (match) {
                            const [, filePath, lineNum, colNum, tsCode, message] = match;

                            diagnostics.push({
                                filePath: path.resolve(this.projectDir, filePath.trim()),
                                line: parseInt(lineNum),
                                column: parseInt(colNum),
                                severity: 'error',
                                code: tsCode,
                                message: message.trim(),
                                rawLine: line
                            });
                        }
                    }
                }

                resolve(diagnostics);
            });
        });
    }

    /**
     * 分析错误并应用修复
     */
    async analyzeAndFixErrors(diagnostics) {
        for (const diagnostic of diagnostics) {
            try {
                const fixResult = await this.fixDiagnostic(diagnostic);
                if (fixResult.fixed) {
                    this.fixesApplied.push(fixResult);
                    console.error(`✅ 修复: ${diagnostic.message} (${path.relative(this.projectDir, diagnostic.filePath)}:${diagnostic.line})`);
                } else {
                    console.error(`⚠️ 无法自动修复: ${diagnostic.message} (${path.relative(this.projectDir, diagnostic.filePath)}:${diagnostic.line})`);
                }
            } catch (error) {
                console.error(`❌ 修复失败: ${error.message} - ${diagnostic.message}`);
            }
        }
    }

    /**
     * 修复单个诊断错误
     */
    async fixDiagnostic(diagnostic) {
        const { filePath, line, code, message } = diagnostic;

        // 确保文件存在
        if (!fs.existsSync(filePath)) {
            return { fixed: false, reason: '文件不存在' };
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        if (line <= 0 || line > lines.length) {
            return { fixed: false, reason: '行号超出范围' };
        }

        const targetLine = lines[line - 1];
        let fixedLine = targetLine;
        let fixApplied = false;

        // 根据错误代码应用不同的修复策略
        switch (code) {
            case '6133': // 已声明但从未使用的变量
                const unusedVarResult = await this.fixUnusedVariable(filePath, line, targetLine, message);
                if (unusedVarResult && unusedVarResult !== true) {
                    if (unusedVarResult === 'remove-line') {
                        lines.splice(line - 1, 1);
                        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                        return {
                            fixed: true,
                            filePath: path.relative(this.projectDir, filePath),
                            line,
                            code,
                            message,
                            originalLine: targetLine,
                            fixedLine: '[LINE REMOVED]'
                        };
                    } else if (unusedVarResult === 'comment-line') {
                        fixedLine = `// ${targetLine}`;
                        fixApplied = true;
                    } else {
                        fixedLine = unusedVarResult;
                        fixApplied = true;
                    }
                } else if (unusedVarResult === true) {
                    fixApplied = true;
                }
                break;

            case '2322': // 类型不匹配
                fixApplied = await this.fixTypeMismatch(filePath, line, targetLine, message);
                break;

            case '2580': // 不能重复声明块范围变量
                const duplicateResult = await this.fixDuplicateDeclaration(filePath, line, targetLine, message);
                if (duplicateResult && duplicateResult !== false) {
                    fixedLine = duplicateResult;
                    fixApplied = true;
                }
                break;

            case '7005': // 隐式 any 类型
            case '7006': // 参数隐式 any 类型
                const implicitAnyResult = await this.fixImplicitAny(filePath, line, targetLine, message);
                if (implicitAnyResult && implicitAnyResult !== false) {
                    fixedLine = implicitAnyResult;
                    fixApplied = true;
                }
                break;

            default:
                // 通用修复：移除未使用的导入
                if (message.includes('defined but never used')) {
                    const importResult = await this.removeUnusedImport(filePath, line, targetLine, message);
                    if (importResult === 'remove-line') {
                        lines.splice(line - 1, 1);
                        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                        return {
                            fixed: true,
                            filePath: path.relative(this.projectDir, filePath),
                            line,
                            code,
                            message,
                            originalLine: targetLine,
                            fixedLine: '[LINE REMOVED]'
                        };
                    } else if (importResult === true) {
                        fixApplied = true;
                    }
                }
                break;
        }

        if (fixApplied) {
            // 更新文件内容
            lines[line - 1] = fixedLine;
            const newContent = lines.join('\n');
            fs.writeFileSync(filePath, newContent, 'utf-8');

            return {
                fixed: true,
                filePath: path.relative(this.projectDir, filePath),
                line,
                code,
                message,
                originalLine: targetLine,
                fixedLine: fixedLine
            };
        }

        return { fixed: false, reason: '不支持的错误类型或无法自动修复' };
    }

    /**
     * 修复未使用的变量
     */
    async fixUnusedVariable(filePath, lineNum, lineContent, message) {
        // 匹配变量名
        const varMatch = message.match(/已声明"([^"]+)"，但从未读取其值。|'([^']+)' is defined but never used/);
        if (!varMatch) return false;

        const varName = varMatch[1] || varMatch[2];

        // 策略1: 如果是函数参数，添加下划线前缀
        const paramMatch = lineContent.match(new RegExp(`(\\(|,\\s*)(${varName}\\s*:\\s*[^,)]+|${varName})(?=\\s*[,)])`));
        if (paramMatch) {
            const prefix = paramMatch[1];
            const param = paramMatch[2];
            const replacement = prefix + (param.startsWith(`${varName}:`) ? `_${param}` : `_${varName}`);
            lineContent = lineContent.replace(paramMatch[0], replacement);
            return true;
        }

        // 策略2: 如果是导入语句，移除整个导入项
        const importMatch = lineContent.match(new RegExp(`import\\s*{([^}]+)}\\s*from\\s*['"][^'"]+['"]`));
        if (importMatch) {
            const imports = importMatch[1].split(',').map(imp => imp.trim());
            const filteredImports = imports.filter(imp => imp !== varName && !imp.startsWith(`${varName} as`));

            if (filteredImports.length === 0) {
                // 如果没有其他导入，移除整行
                return 'remove-line';
            } else {
                const newImport = `import { ${filteredImports.join(', ')} } from`;
                lineContent = lineContent.replace(importMatch[0], newImport);
                return true;
            }
        }

        // 策略3: 如果是变量声明，注释掉
        if (lineContent.includes('const ') || lineContent.includes('let ') || lineContent.includes('var ')) {
            return 'comment-line';
        }

        return false;
    }

    /**
     * 修复类型不匹配
     */
    async fixTypeMismatch(_filePath, _lineNum, _lineContent, _message) {
        // 这里可以实现更复杂的类型推断和修复逻辑
        // 目前只记录，不自动修复，因为类型错误需要开发者判断
        return false;
    }

    /**
     * 修复重复声明
     */
    async fixDuplicateDeclaration(filePath, lineNum, lineContent, message) {
        // 重命名重复的变量
        const varMatch = message.match(/Cannot redeclare block-scoped variable '([^']+)'/);
        if (!varMatch) return false;

        const varName = varMatch[1];
        const newName = `${varName}_${Date.now()}`;

        const newLineContent = lineContent.replace(new RegExp(`\\b${varName}\\b`, 'g'), newName);
        return newLineContent !== lineContent ? newLineContent : false;
    }

    /**
     * 修复隐式 any 类型
     */
    async fixImplicitAny(filePath, lineNum, lineContent, message) {
        // 检查是否是参数隐式 any 错误
        if (message.includes("Parameter") && message.includes("implicitly has an 'any' type")) {
            const paramMatch = message.match(/Parameter '([^']+)'/);
            if (!paramMatch) return false;

            const paramName = paramMatch[1];

            // 直接查找并替换参数，添加类型注解
            const paramWithSuffixMatch = lineContent.match(new RegExp(`(${paramName})(\\s*[),])`));
            if (paramWithSuffixMatch) {
                const suffix = paramWithSuffixMatch[2];
                const replacement = `${paramName}: unknown${suffix}`;
                lineContent = lineContent.replace(paramWithSuffixMatch[0], replacement);
                return lineContent;
            }
        }

        // 通用修复：为参数添加类型注解
        const paramMatch = lineContent.match(/([^=]+\s+)(\w+)(\s*[:=])/);
        if (paramMatch) {
            const prefix = paramMatch[1];
            const paramName = paramMatch[2];
            const suffix = paramMatch[3];

            // 根据参数名推断类型
            let inferredType = 'unknown';
            if (paramName.toLowerCase().includes('id')) inferredType = 'string | number';
            if (paramName.toLowerCase().includes('count') || paramName.toLowerCase().includes('length')) inferredType = 'number';
            if (paramName.toLowerCase().includes('is') || paramName.toLowerCase().includes('has')) inferredType = 'boolean';
            if (paramName.toLowerCase().includes('data') || paramName.toLowerCase().includes('items')) inferredType = 'unknown[]';

            lineContent = `${prefix}${paramName}: ${inferredType}${suffix}`;
            return true;
        }

        return false;
    }

    /**
     * 移除未使用的导入
     */
    async removeUnusedImport(filePath, lineNum, lineContent, message) {
        const importMatch = message.match(/'([^']+)' is defined but never used/);
        if (!importMatch) return false;

        const importName = importMatch[1];

        // 从导入语句中移除特定项
        const importRegex = new RegExp(`import\\s*{([^}]+)}\\s*from\\s*['"][^'"]+['"]`);
        const match = lineContent.match(importRegex);

        if (match) {
            const imports = match[1].split(',').map(imp => imp.trim());
            const filteredImports = imports.filter(imp => imp !== importName && !imp.includes(`${importName} as`));

            if (filteredImports.length === 0) {
                return 'remove-line';
            } else {
                const newImport = `import { ${filteredImports.join(', ')} } from`;
                lineContent = lineContent.replace(match[0], newImport);
                return true;
            }
        }

        return false;
    }

    /**
     * 验证修复结果
     */
    async verifyFixes() {
        console.error('🔍 验证修复结果...');

        try {
            const remainingDiagnostics = await this.getTypeScriptDiagnostics();
            const originalErrorCount = this.errorsDetected.length;
            const remainingErrorCount = remainingDiagnostics.length;
            const fixedCount = originalErrorCount - remainingErrorCount;

            return {
                success: fixedCount > 0,
                fixedCount,
                remainingErrorCount,
                remainingErrors: remainingDiagnostics
            };
        } catch (error) {
            console.error('❌ 验证过程中发生错误:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 生成修复报告
     */
    generateReport(result) {
        const report = [];

        report.push('\n🔧 TypeScript 错误修复报告');
        report.push('━'.repeat(50));

        if (result.success) {
            report.push(`✅ 修复完成！共修复 ${result.fixesApplied.length} 个错误`);

            if (result.remainingErrors && result.remainingErrors.length > 0) {
                report.push(`⚠️ 仍有 ${result.remainingErrors.length} 个错误需要手动处理:`);
                result.remainingErrors.forEach(error => {
                    const relativePath = path.relative(this.projectDir, error.filePath);
                    report.push(`  - ${error.message} (${relativePath}:${error.line})`);
                });
            }
        } else {
            report.push(`❌ 修复失败: ${result.error || '未知错误'}`);
        }

        if (result.fixesApplied.length > 0) {
            report.push('\n📝 应用的修复:');
            result.fixesApplied.forEach(fix => {
                report.push(`  ✅ ${fix.message} (${fix.filePath}:${fix.line})`);
            });
        }

        return report.join('\n');
    }
}

/**
 * 主函数
 */
async function main() {
    try {
        const projectDir = process.cwd();
        const resolver = new TypeScriptErrorResolver(projectDir);

        console.error('🚀 TypeScript 自动错误修复器启动...');
        console.error(`📁 项目目录: ${projectDir}`);

        const result = await resolver.resolveErrors();
        const report = resolver.generateReport(result);

        console.error(report);

        // 输出修复结果供其他脚本使用
        if (result.fixesApplied.length > 0) {
            console.log(JSON.stringify({
                fixed: result.fixesApplied.length,
                remaining: result.remainingErrors?.length || 0,
                success: result.success
            }));
        }

        process.exit(result.success ? 0 : 1);

    } catch (error) {
        console.error('💥 未捕获的异常:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = TypeScriptErrorResolver;