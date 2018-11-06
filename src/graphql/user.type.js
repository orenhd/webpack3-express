import jwt from 'jsonwebtoken';
import { composeWithMongoose } from 'graphql-compose-mongoose';

import { UserModel } from '../models/user.model';
import * as userConsts from '../consts/user.consts';
import { tokenAccess } from "./shared";

import config from '../config';

const customizationOptions = {};
const UserTC = composeWithMongoose(UserModel, customizationOptions);

UserTC.removeField('password'); // never return the password field

UserTC.addFields({
    isFriend: 'Boolean',
});

UserTC.addRelation(
    'friendsList',
    {
        resolver: () => UserTC.getResolver('getUsersByIds'),
        prepareArgs: {
            userids: source => source.friends,
        },
    }
);

UserTC.addResolver({
  kind: 'mutation',
  name: 'userSignup',
  args: {
    username: {
      type: 'String!',
    },
    password: {
      type: 'String!',
    },
  },
  type: 'String',
  resolve: ({ args, context }) => {
    const { username, password } = args;

    return UserModel.create({
      username,
      password
    }).then((resp) => {
      return 'Success';
    });
  },
});

UserTC.addResolver({
    kind: 'query',
    name: 'userLogin',
    args: {
        username: {
            type: 'String!',
        },
        password: {
            type: 'String!',
        },
    },
    type: 'String',
    resolve: ({ args, context }) => {
        const { username, password } = args;
        return UserModel.findOne({ username }).select('+password').then((user) => {
            if (user) {
                // test a matching password
                return user.comparePassword(password).then((isMatch) => {
                    if (isMatch) {
                        const token = jwt.sign({ _id: user._id }, config.app.at_string, {
                            expiresIn: config.app.jwt_life_span
                        });
                        return token;
                    } else {
                        throw new Error(userConsts.AUTH_FAILED_PASSWORD_MSG);
                    }
                });
            } else {
                throw new Error(userConsts.AUTH_FAILED_USER_MSG);
            }
        });
    },
});

UserTC.addResolver({
    kind: 'query',
    name: 'getUser',
    args: {
        username: {
            type: 'String!',
        },
    },
    type: UserTC,
    resolve: ({ args, context }) => {
        const { decoded } = context;
        const { username } = args;
        return Promise.all([
            UserModel.findOne({ _id: decoded._id }), // retrieve the user who submitted the request
            UserModel.findOne({ username }) // retrieve the requested user
        ]).then(([user, member]) => {
            if (user && member) {
                const isFriend = member.friends && member.friends.length && member.friends.includes(user._id.toString()) ? true : false; // verify friendship
                return { ...member.toObject(), isFriend };
            } else {
                return null;
            }
        });
    },
});

UserTC.addResolver({
    kind: 'query',
    name: 'getUsersByIds',
    args: {
        userids: {
            type: '[String]!',
        },
    },
    type: [UserTC],
    resolve: ({ args, context }) => {
        const { userids } = args;
        return Promise.all(userids.map((userid) => {
            return UserModel.findOne({ _id: userid })
        })).then((users) => {
            return users;
        });
    },
});

export const UserQueries = {
  userLogin: UserTC.getResolver('userLogin'),
  ...tokenAccess({
    getUser: UserTC.getResolver('getUser'),
  }),
};

export const UserMutations = {
  userSignup: UserTC.getResolver('userSignup'),
}

export default UserTC;
