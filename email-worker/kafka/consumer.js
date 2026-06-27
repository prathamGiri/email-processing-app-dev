const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'email-worker',
    brokers: ['kafka:9092']
});

const consumer = kafka.consumer({
    groupId: 'email-workers'
});

const consumerConnect = async () => {
    while(true){
        try{
            await consumer.connect();
            console.log('Connected to Kafka');
            break;
        }catch(err){
            console.log('Waiting to connect to kafka');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
}

module.exports = {consumer, consumerConnect};