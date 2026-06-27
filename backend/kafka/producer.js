const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'email-api',
    brokers: ['kafka:9092']
});

const producer = kafka.producer();

const producerConnect = async () => {
    while (true) {
        try {
            await producer.connect();
            console.log("Kafka connected");
            break;
        } catch (err) {
            console.log("Waiting for Kafka...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}
module.exports = {producer, producerConnect};