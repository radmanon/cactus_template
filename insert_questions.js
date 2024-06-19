const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;

mongoose.connect(`mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority&ssl=true`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

const questionSchema = new mongoose.Schema({
    question: String,
    order: Number,
    options: [
        {
            text: String,
            nextQuestionId: mongoose.Types.ObjectId
        }
    ]
});

const Question = mongoose.model('Question', questionSchema);

const questions = [
    {
        _id: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff99'), // Valid ObjectId
        question: 'What is your issue?',
        order: 1,
        options: [
            { text: 'Bath', nextQuestionId: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9a') },
            { text: 'Kitchen', nextQuestionId: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9b') },
            { text: 'Vent', nextQuestionId: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9c') }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9a'), // Valid ObjectId
        question: 'What kind of bath issue are you facing?',
        order: 2,
        options: [
            { text: 'Leaking', nextQuestionId: null },
            { text: 'Clogged Drain', nextQuestionId: null },
            { text: 'No Hot Water', nextQuestionId: null }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9b'), // Valid ObjectId
        question: 'What kind of kitchen issue are you facing?',
        order: 2,
        options: [
            { text: 'Broken Appliance', nextQuestionId: null },
            { text: 'Clogged Sink', nextQuestionId: null },
            { text: 'Electrical Issue', nextQuestionId: null }
        ]
    },
    {
        _id: new mongoose.Types.ObjectId('60d5ec49d50b9b27d8e7ff9c'), // Valid ObjectId
        question: 'What kind of vent issue are you facing?',
        order: 2,
        options: [
            { text: 'Poor Airflow', nextQuestionId: null },
            { text: 'Strange Odors', nextQuestionId: null },
            { text: 'Noise', nextQuestionId: null }
        ]
    }
];

Question.insertMany(questions)
    .then(() => {
        console.log('Questions inserted successfully');
        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error inserting questions:', error);
        mongoose.connection.close();
    });
