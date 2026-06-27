const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'email-worker',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({
    groupId: 'email-workers'
});

module.exports = consumer;