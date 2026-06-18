declare module "africastalking" {
  interface AfricasTalkingOptions {
    apiKey: string;
    username: string;
  }

  interface SendSmsOptions {
    to: string[];
    message: string;
    from?: string;
  }

  interface SMS {
    send(options: SendSmsOptions): Promise<any>;
  }

  interface AfricasTalkingInstance {
    SMS: SMS;
  }

  function AfricasTalking(options: AfricasTalkingOptions): AfricasTalkingInstance;
  export = AfricasTalking;
}