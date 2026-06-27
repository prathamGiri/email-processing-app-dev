const {consumer, consumerConnect} = require('./kafka/consumer');
const sendEmail = require('./utils/sendEmail');

async function start() {

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

}

start();