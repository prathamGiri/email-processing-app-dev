const {consumer, consumerConnect} = require('./kafka/consumer');
const sendEmail = require('./utils/sendEmail');

async function start() {
    while (true) {
        try{
            await consumerConnect()

            await consumer.subscribe({
                topic: 'email-jobs'
            });

            console.log("Worker listening...");

            await consumer.run({

                eachMessage: async ({ message }) => {

                    const job =
                        JSON.parse(message.value.toString());

                    console.log(job);

                    await sendEmail(
                        job.email,
                        job.subject,
                        job.body
                    );
                }

            });
        }catch(err){
            console.log("Kafka not ready yet...");
            console.log(err.message);

            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

start();