import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class PhoneCommand implements ISlashCommand {
    public command = 'phone';
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand] = context.getArguments();

        if (!subcommand) {
            throw new Error('Error!');
        }

        switch (subcommand) {
            case 'text':
                await this.sendMessage(context, modify, 'Texting!');
                break;

            case 'call':
                await this.sendMessage(context, modify, 'Calling!');
                break;

            case 'email':
                try {
                    const fromEmail = await read.getEnvironmentReader().getServerSettings().getValueById('From_Email');
                
                await modify
                    .getCreator()
                    .getEmailCreator()
                    .send({
                        to: 'funke.olasupo@rocket.chat',
                        from: fromEmail,
                        subject: 'This is a subject :P',
                        replyTo: undefined,
                        headers: undefined,
                        text: `this email was sent from apps engine, cool right?`,
                        html: `<p>this email was sent from apps engine, cool right?</p>`,
                    });
                console.log('Email Sent')
                } catch (e) {
                    console.error(e);
                }
                

            default:
                throw new Error('Error!');
        }
    }
    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender();
        const room = context.getRoom();

        messageStructure
            .setSender(sender)
            .setRoom(room)
            .setText(message);

        await modify.getCreator().finish(messageStructure);
    }
}