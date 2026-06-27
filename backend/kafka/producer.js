const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'email-api',
    brokers: ['kafka:9092']
});

const producer = kafka.producer();

module.exports = producer;