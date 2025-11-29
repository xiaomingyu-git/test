---
name: dev-task-management
description: Comprehensive guide for managing development tasks created with /dev-docs command. Covers task planning, execution, documentation, and completion workflows. Activates when working with dev/ directory tasks, /dev-docs commands, or development project planning.
---

# Development Task Management

## Purpose

Specialized skill for managing development tasks created through the `/dev-docs` slash command. This skill provides comprehensive guidance for task planning, execution, documentation maintenance, and completion workflows.

## When to Use

**Automatic Activation** when you mention:
- `/dev-docs` command usage
- Development task planning and execution
- Working with `dev/active/` or `dev/completed/` directories
- Task documentation and progress tracking
- Development project management
- Strategic planning for complex features

**Manual Activation** for:
- Reviewing development task best practices
- Optimizing development workflow
- Task prioritization and management
- Documentation standards

---

## Development Task Lifecycle

### 1. Task Creation Phase

**Using `/dev-docs` Command**
```
/dev-docs [task description]
```

**What Gets Created**:
```
dev/active/[task-name]/
├── [task-name]-plan.md      # Comprehensive strategic plan
├── [task-name]-context.md   # Technical context and dependencies
└── [task-name]-tasks.md     # Detailed task checklist
```

**Plan File Structure**:
- Executive Summary
- Current State Analysis
- Proposed Future State
- Implementation Phases
- Detailed Tasks (with acceptance criteria)
- Risk Assessment
- Success Metrics
- Timeline Estimates

### 2. Task Execution Phase

**Best Practices**:
- Update task files as work progresses
- Mark completed items with ✅
- Document blockers and issues discovered
- Update context with new findings
- Track time spent vs. estimates

**Progress Tracking**:
```markdown
### Task Status Examples
- [x] Completed task
- [ ] Pending task
- [🟡] In progress task
- [🔴] Blocked task
- [⏸️] Paused task
```

### 3. Task Completion Phase

**Completion Checklist**:
- [ ] All tasks marked as completed
- [ ] Context documentation updated with final state
- [ ] Lessons learned documented
- [ ] Results and outcomes recorded
- [ ] Move to `/dev/completed/` directory
- [ ] Update main `/dev/README.md` index

## Directory Management

### Directory Structure
```
dev/
├── README.md              # Main development process guide
├── active/                # Currently active tasks
│   └── [task-name]/       # Active task directories
└── completed/             # Completed tasks for reference
    └── [task-name]/       # Completed task archives
```

### File Naming Conventions
```
[task-name]-plan.md        # Strategic implementation plan
[task-name]-context.md     # Technical context and dependencies
[task-name]-tasks.md       # Detailed task checklist
```

## Task Documentation Standards

### Plan File Template
```markdown
# [Task Name] Plan

**Last Updated: YYYY-MM-DD**

## Executive Summary
[Brief overview of objectives and scope]

## Current State Analysis
[Analysis of existing situation]

## Proposed Future State
[Target end state and improvements]

## Implementation Phases
[Numbered phases with detailed breakdown]

## Risk Assessment
[Risks and mitigation strategies]

## Success Metrics
[Measurable success criteria]

## Timeline Estimates
[Realistic time estimates per phase]
```

### Context File Template
```markdown
# [Task Name] Context

**Last Updated: YYYY-MM-DD**

## Technical Dependencies
[Systems, files, and external dependencies]

## Integration Points
[How this task connects to other systems]

## Risk Considerations
[Technical and operational risks]

## Success Criteria
[Definition of done and success metrics]
```

### Tasks File Template
```markdown
# [Task Name] Task Checklist

**Last Updated: YYYY-MM-DD**

## Phase 1: [Phase Name]
### Task 1.1: [Task Description]
- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Timeline Tracking
### Phase 1 (Days X-Y)
- [ ] Task 1.1 - Status
- [ ] Task 1.2 - Status

## Notes and Observations
### Change Log
- [Date]: Change description
```

## Integration with Skill System

### Automatic Detection Triggers
- Files in `dev/active/` directories
- Keywords: "dev-docs", "development task", "task planning"
- File patterns: `dev/**/*.md`, `dev/**/*plan.md`, `dev/**/*tasks.md`

### Context Preservation
- Maintains task state across context resets
- Preserves technical decisions and rationale
- Tracks progress and blockers
- Documents lessons learned

## Best Practices

### ✅ Recommended Practices
1. **Plan Before Execute**: Use `/dev-docs` for complex tasks
2. **Update Regularly**: Keep documentation current with progress
3. **Be Specific**: Include concrete acceptance criteria
4. **Document Decisions**: Record why decisions were made
5. **Track Time**: Compare estimates vs actual time spent
6. **Archive Completed**: Move finished tasks to `/dev/completed/`
7. **Learn From Experience**: Document lessons learned

### ❌ Common Pitfalls
1. **Out of Sync**: Documentation not matching actual progress
2. **Too Vague**: Tasks without clear acceptance criteria
3. **Abandoned Tasks**: Starting but not completing task documentation
4. **No Context**: Missing technical dependencies and constraints
5. **Poor Naming**: Inconsistent or unclear task/directory names

## Advanced Features

### Task Dependencies
```markdown
## Dependencies
- Depends on: [other-task-name]
- Blocks: [blocked-task-name]
- Related: [related-task-name]
```

### Status Tracking
```markdown
## Status Dashboard
- **Active Tasks**: [number]
- **Completed Tasks**: [number]
- **Blocked Tasks**: [number]
- **Average Completion Time**: [days]
```

### Time Analysis
```markdown
## Time Tracking
- **Estimated**: [X] days
- **Actual**: [Y] days
- **Variance**: [±Z]%
- **Lessons Learned**: [time estimation insights]
```

## Command Integration

### Available Commands
- `/dev-docs [task]` - Create new development task
- `/dev-docs-update` - Update existing task documentation

### File Operations
- **Create**: Generate task structure automatically
- **Update**: Modify existing task files
- **Archive**: Move completed tasks to reference
- **Index**: Update main README with completed tasks

## Troubleshooting

### Common Issues
1. **Task Not Found**: Check `dev/active/` and `dev/completed/` directories
2. **Documentation Outdated**: Look for "Last Updated" timestamps
3. **Missing Context**: Check context file for dependencies
4. ** blockers**: Review tasks file for blocked items

### Recovery Procedures
1. **Lost Task**: Search all `dev/` directories
2. **Corrupted Files**: Check for backup versions
3. **Context Reset**: Use task documentation to rebuild context

## Related Skills

- **skill-developer**: For creating and managing skills
- **vue-dev-guidelines**: For Vue-specific development tasks
- **error-tracking**: For debugging and monitoring tasks

---

**Skill Status**: Active development task management specialist
**Use Case**: Comprehensive support for /dev-docs workflow