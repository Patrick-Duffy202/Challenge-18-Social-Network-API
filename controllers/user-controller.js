const { Thought, User } = require('../models');

const userController = {
    // get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v',
        populate: { path: 'reactions'}
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // create user
    createUser({ body }, res) {
        User.create({ username: body.username, email: body.email })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

  // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // add friend to user
    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId },{ $push: { friends: { _id: params.friendId } } },{ new: true, runValidators: true })
        .then(dbUserData => {
         if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
    // remove a friend from user
    removeFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId}, { $pull: { friends: { _id: params.friendId} } })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No friend found with this id!' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },
};

module.exports = userController;