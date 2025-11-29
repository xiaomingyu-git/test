#!/usr/bin/env node

const fs = require('fs');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

function logUserInput(prompt) {
    try {
        const logDir = join(process.cwd(), '.claude');
        const logFile = join(logDir, 'user-input.log');

        // 确保目录存在
        if (!existsSync(logDir)) {
            mkdirSync(logDir, { recursive: true });
        }

        // 记录用户输入
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${prompt}\n`;

        if (existsSync(logFile)) {
            // 追加到现有日志
            fs.appendFileSync(logFile, logEntry);
        } else {
            // 创建新日志文件
            writeFileSync(logFile, logEntry);
        }
    } catch (error) {
        console.error('记录用户输入时出错:', error.message);
    }
}

async function main() {
    try {
        // 从stdin读取输入
        const input = readFileSync(0, 'utf-8');
        const data = JSON.parse(input);
        const prompt = data.prompt.toLowerCase();
        const originalPrompt = data.prompt;

        // 记录用户输入到日志文件
        logUserInput(originalPrompt);

        // 检查是否包含 /fest 命令
        if (prompt.includes('/fest')) {
            console.log('🚀 检测到 /fest 命令，准备启动完整测试流程...');
            // 触发 /fest 流程
            setTimeout(() => {
                const { spawn } = require('child_process');
                spawn('node', ['.claude/hooks/ftest-trigger.cjs'], {
                    stdio: 'inherit',
                    shell: true,
                    detached: true
                }).unref();
            }, 1000);
        }

        // 加载技能规则
        const projectDir = process.cwd();
        const rulesPath = join(projectDir, '.claude', 'skills', 'skill-rules.json');

        if (!existsSync(rulesPath)) {
            process.exit(0);
        }

        const rules = JSON.parse(readFileSync(rulesPath, 'utf-8'));
        const matchedSkills = [];

        // 检查每个技能的匹配
        for (const [skillName, config] of Object.entries(rules.skills)) {
            const triggers = config.promptTriggers;
            if (!triggers) {
                continue;
            }

            // 关键词匹配
            if (triggers.keywords) {
                const keywordMatch = triggers.keywords.some(kw =>
                    prompt.includes(kw.toLowerCase())
                );
                if (keywordMatch) {
                    matchedSkills.push({ name: skillName, matchType: 'keyword', config });
                    continue;
                }
            }

            // 意图模式匹配
            if (triggers.intentPatterns) {
                const intentMatch = triggers.intentPatterns.some(pattern => {
                    const regex = new RegExp(pattern, 'i');
                    return regex.test(prompt);
                });
                if (intentMatch) {
                    matchedSkills.push({ name: skillName, matchType: 'intent', config });
                }
            }
        }

        // 如果找到匹配，生成输出
        if (matchedSkills.length > 0) {
            let output = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            output += '🎯 SKILL ACTIVATION CHECK\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

            // 按优先级分组
            const critical = matchedSkills.filter(s => s.config.priority === 'critical');
            const high = matchedSkills.filter(s => s.config.priority === 'high');
            const medium = matchedSkills.filter(s => s.config.priority === 'medium');
            const low = matchedSkills.filter(s => s.config.priority === 'low');

            if (critical.length > 0) {
                output += '⚠️ CRITICAL SKILLS (REQUIRED):\n';
                critical.forEach(s => output += `  → ${s.name}\n`);
                output += '\n';
            }

            if (high.length > 0) {
                output += '📚 RECOMMENDED SKILLS:\n';
                high.forEach(s => output += `  → ${s.name}\n`);
                output += '\n';
            }

            if (medium.length > 0) {
                output += '💡 SUGGESTED SKILLS:\n';
                medium.forEach(s => output += `  → ${s.name}\n`);
                output += '\n';
            }

            if (low.length > 0) {
                output += '📌 OPTIONAL SKILLS:\n';
                low.forEach(s => output += `  → ${s.name}\n`);
                output += '\n';
            }

            output += 'ACTION: Use Skill tool BEFORE responding\n';
            output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

            console.log(output);
        }

        process.exit(0);
    } catch (err) {
        console.error('Error in skill-activation-prompt hook:', err);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
});