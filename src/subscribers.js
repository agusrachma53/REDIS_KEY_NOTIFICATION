
class Subscriber {
    constructor(client) {
        this.sub = client;
    }

    init() {
        console.log('RedisSubscriber', 'Redis subscriber is activated')
        this.subscriberForNotificationActivity();
    }
    async subscriberForNotificationActivity() {
        const key = '__keyevent@0__:expired';
        this.sub.psubscribe(key, (_, mjy) => {
            this.sub.on('pmessage', async (err, channel, message) => {
                console.log(err);
                console.log(channel)
                console.log(message)
                return true;
            });
        });
    }
}

module.exports = Subscriber;
