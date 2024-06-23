import mongoose from 'mongoose';

const { Schema } = mongoose;

const QuizSchema = new Schema({
    question: String,
    answerA: String,
    answerB: String,
    answerC: String,
    answerD: String,
    correct: String,
});

export default mongoose.model('Quiz', QuizSchema);