import {
  addReminder,
  getPendingReminders,
  cancelReminder,
  addScheduledCall,
  saveLead,
  ScheduledReminder,
  ScheduledCall,
  CapturedLead,
} from '../reminderManager';
import { getTenantConfig } from '../config';

export interface ToolExecutionContext {
  tenantId: string;
  jid: string;
  contactName?: string;
}

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'schedule_reminder',
      description:
        'Schedule a real autonomous WhatsApp reminder. The bot will proactively message the user on WhatsApp at the exact due time.',
      parameters: {
        type: 'object',
        properties: {
          task: {
            type: 'string',
            description: 'The task, event, or note to be reminded about (e.g. "Check server logs", "Call Rahul", "Review contract").',
          },
          delayMinutes: {
            type: 'number',
            description: 'Minutes from now when the reminder should fire (e.g. 15, 30, 60, 1440 for tomorrow).',
          },
        },
        required: ['task', 'delayMinutes'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_reminders',
      description: 'Check all currently pending reminders scheduled for this WhatsApp chat.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'cancel_reminder',
      description: 'Cancel an active reminder by ID or task name keyword.',
      parameters: {
        type: 'object',
        properties: {
          reminderId: {
            type: 'string',
            description: 'The reminder ID or a keyword matching the task name to cancel.',
          },
        },
        required: ['reminderId'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'schedule_call',
      description:
        'Schedule a phone call, voice consultation, or meeting slot with the client.',
      parameters: {
        type: 'object',
        properties: {
          clientName: {
            type: 'string',
            description: 'Name of the client requesting the call.',
          },
          clientPhone: {
            type: 'string',
            description: 'Phone number of the client.',
          },
          topic: {
            type: 'string',
            description: 'Topic or requirement to discuss on the call.',
          },
          preferredTime: {
            type: 'string',
            description: 'The preferred day/time requested by the client (e.g. "Tomorrow 4 PM", "Today at 6 PM").',
          },
        },
        required: ['clientName', 'topic', 'preferredTime'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_portfolio',
      description:
        'Retrieve the business website URL, services, and portfolio details.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Optional category (e.g. "all", "services", "work").',
          },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'save_lead',
      description: 'Capture and save a new client requirement, inquiry, or project lead.',
      parameters: {
        type: 'object',
        properties: {
          clientName: {
            type: 'string',
            description: 'Name of the lead or client.',
          },
          requirements: {
            type: 'string',
            description: 'Detailed description of the project requirements or tech stack needed.',
          },
          budget: {
            type: 'string',
            description: 'Client budget range if mentioned.',
          },
        },
        required: ['clientName', 'requirements'],
      },
    },
  },
];

export async function executeTool(
  toolName: string,
  args: any,
  context: ToolExecutionContext
): Promise<any> {
  const { tenantId, jid, contactName } = context;

  console.log(`[Tool Engine] Executing tool '${toolName}' for ${jid} (tenant: ${tenantId}) with args:`, args);

  switch (toolName) {
    case 'schedule_reminder': {
      const delayMinutes = Math.max(1, Number(args.delayMinutes) || 10);
      const dueTimestamp = Date.now() + delayMinutes * 60 * 1000;
      const task = String(args.task || 'Reminder task');
      const reminder: ScheduledReminder = addReminder(tenantId, jid, task, dueTimestamp);

      return {
        success: true,
        reminderId: reminder.id,
        task: reminder.task,
        dueInMinutes: delayMinutes,
        message: `Reminder successfully scheduled. The bot will proactively message you in ${delayMinutes} minutes: "${task}".`,
      };
    }

    case 'get_reminders': {
      const list = getPendingReminders(tenantId, jid);
      return {
        success: true,
        count: list.length,
        reminders: list.map((r) => ({
          id: r.id,
          task: r.task,
          dueInMinutes: Math.max(1, Math.round((r.dueTimestamp - Date.now()) / 60000)),
        })),
        message: list.length > 0
          ? `Found ${list.length} active reminder(s).`
          : 'No pending reminders scheduled for this chat.',
      };
    }

    case 'cancel_reminder': {
      const reminderId = String(args.reminderId || '');
      const ok = cancelReminder(tenantId, reminderId);
      return {
        success: ok,
        message: ok
          ? `Reminder "${reminderId}" has been cancelled.`
          : `No pending reminder found matching "${reminderId}".`,
      };
    }

    case 'schedule_call': {
      const clientName = String(args.clientName || contactName || 'Client');
      const clientPhone = String(args.clientPhone || jid.split('@')[0]);
      const topic = String(args.topic || 'Project Discussion');
      const preferredTime = String(args.preferredTime || 'Soon');

      const callRecord: ScheduledCall = addScheduledCall(
        tenantId,
        jid,
        clientName,
        clientPhone,
        topic,
        preferredTime
      );

      return {
        success: true,
        callId: callRecord.id,
        clientName,
        preferredTime,
        topic,
        meetLink: callRecord.meetLink || 'https://meet.google.com/new',
        message: `Call booked for ${preferredTime} regarding "${topic}". A calendar invite / Google Meet link will be sent.`,
      };
    }

    case 'get_portfolio': {
      const cfg = getTenantConfig(tenantId);
      const url = (cfg as any).websiteUrl || (cfg as any).portfolioUrl || '';
      const bizName = cfg.botName || 'our team';

      return {
        success: true,
        businessName: bizName,
        websiteUrl: url || undefined,
        message: url
          ? `Our official website and portfolio is live at ${url}.`
          : `You can share your requirements directly with us here, or let us know a preferred time to connect.`,
      };
    }

    case 'save_lead': {
      const clientName = String(args.clientName || contactName || 'Client');
      const requirements = String(args.requirements || '');
      const budget = args.budget ? String(args.budget) : undefined;

      const lead: CapturedLead = saveLead(tenantId, jid, clientName, requirements, budget);

      return {
        success: true,
        leadId: lead.id,
        message: 'Lead information recorded successfully. Our team will follow up shortly.',
      };
    }

    default:
      return {
        success: false,
        error: `Unknown tool: ${toolName}`,
      };
  }
}
