import mongoose from 'mongoose';
import Questions from '../models/Questions.js'

export const AskQuestion = async (req, res) => {
    try {
        const postQuestionBody = req.body;
        console.log(postQuestionBody);
        const postedQuestion = await Questions.create(postQuestionBody)
        console.log(req.body)
        res.status(200).json({
            status: 'Success',
            data: postedQuestion
        })
    } catch (err) {
        res.status(500).json({ status: 'Error creating Question', data: err.message })
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Questions.find();
        res.status(200).json(questions)
    } catch (err) { console.log(err); }
}

export const deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("Question not vailable")
    }
    try {
        await Questions.findByIdAndRemove(_id)
        res.status(200).json({ message: "Successfully Destroyed!" })
    } catch (error) {
        res.status(500).json("ERRURRR!")
    }
}

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json("Question not vailable")
    }
    try {
        const question = await Questions.findById(_id);
        const upIndex = question.upVote.findIndex(id => id === String(userId));//true or else -1
        const downIndex = question.downVote.findIndex(id => id === String(userId));

        if (value === 'upvote') {
            if (downIndex !== -1) { //already downVoted by User
                question.downVote = question.downVote.filter(id => id !== String(userId))
            }
            if (upIndex === -1) {//User havent Up as well as DownVoted
                question.upVote.push(userId)
            } else {//user already upVoted and we are removing him
                question.upVote = question.upVote.filter(id => id !== String(user))
            }

        }
        else if (value === 'downvote') {
            if (upIndex !== -1) { //already downVoted by User
                question.upVote = question.upVote.filter(id => id !== String(userId))
            }
            if (downIndex === -1) {//User havent Up as well as DownVoted
                question.downVote.push(userId)
            } else {//user already upVoted and we are removing him
                question.downVote = question.downVote.filter(id => id !== String(user))
            }

        }
        await Questions.findByIdAndUpdate(_id, question)

        res.status(200).json({message:"Voted Successffully!!"})
    }catch(err){
        res.status(500).json("Error!")
    }
}
