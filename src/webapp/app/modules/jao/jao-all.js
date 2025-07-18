/**
 * JAO Module - All Components Import
 * This file imports all JAO module components for webpack bundling
 *
 * @author Auto-generated for webpack integration
 */

// IMPORTANT: Module definition must be loaded first
import './jao.module.js';

// Core utilities and services (load before controllers)
import './jao-util.js';
import './job.service.js';

// Core state configuration
import './jao.state.js';

// Core controllers and components
import './job.controller.js';
import './job-edit.controller.js';
import './job-list.controller.js';
import './job-list.component.js';
import './job-quick-run.component.js';
import './job-result-view.component.js';
import './job-run-button.directive.js';

// CronJob module - Service first, then controllers
import './cronJob/cron-job.service.js';
import './cronJob/cron/cronboot.js';
import './cronJob/cron/init.js';
import './cronJob/cron-job-list.controller.js';
import './cronJob/cron-job-dialog.controller.js';

// Command module
import './command/command.service.js';
import './command/command.state.js';
import './command/command-list.controller.js';
import './command/command-edit.controller.js';
import './command/command-console.controller.js';
import './command/command-approve.controller.js';
import './command/command-job-config.component.js';
import './command/command-job-edit.controller.js';
import './command/commandselector/command-dynamic-selector.component.js';

// Flow module
import './flow/flow.service.js';
import './flow/flow.controller.js';
import './flow/flow-edit.controller.js';
import './flow/flow-instance-list.controller.js';
import './flow/flow-instance-view.controller.js';
import './flow/flow-step.controller.js';
import './flow/host-selector.component.js';
import './flow/host-dynamic-selector.component.js';

// Process module
import './process/process-builder.service.js';
import './process/process-modeler.component.js';

// Job config components
import './script-job-config.component.js';
import './rest-job-config.component.js';
import './process-job-config.component.js';

// Script test run
import './script-test-run.component.js';

// Ansible components
import './ansible-progress-component.js';
import './ansible/ansible-log-viewer.component.js';
import './ansible/playbook-info.component.js';

// Data model components
import './datamodel/dc-data.service.js';
import './datamodel/dc-data-add.controller.js';
import './datamodel/dc-data-view.component.js';
import './datamodel/dc-model-config.component.js';
import './datamodel/dc-selector.component.js';

// Helper components
import './helper/job-selector.component.js';
import './helper/aap-template-selector.component.js';

// Log components
import './logs/clean-log.controller.js';
import './logview/ao-view.component.js';
import './logview/ao-view-table.component.js';
import './logview/jao-operation-log-list.component.js';
import './logview/logview-widget.js';

// Widget components
import './widgets/approveList/job-approve-list.component.js';
import './widgets/approveModal/job-approve-modal.component.js';
import './widgets/delayed/job-delayed.component.js';
import './widgets/hostselector2/device-dynamic-selector.component.js';
import './widgets/hostselector2/device-selector-widget.js';
import './widgets/hostselector2/jao-device-selector.component.js';
import './widgets/job/job-widget.js';
import './widgets/jobParam/job-param.component.js';

// Demo file (if needed)
import './jao-demo.js';
