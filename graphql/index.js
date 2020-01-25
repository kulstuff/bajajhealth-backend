const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat } = graphql
const Axios = require('axios')
// Userbase
const User = require('../schema/models/User')
const Metric = require('../schema/models/Metric')
const Challenge = require('../schema/models/Challenge')
const Diet = require('../schema/models/Diet')
const Insurance = require('../schema/models/Insurance')
const Reward = require('../schema/models/Reward')
const Offer = require('../schema/models/Offer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        healthIndex: { type: GraphQLFloat },
        bmi: { type: GraphQLFloat },
        hp: { type: GraphQLFloat },
        bp: { type: GraphQLFloat },
        height: { type: GraphQLFloat },
        weight: { type: GraphQLFloat },
        gender: { type: GraphQLString },
        gToken: { type: GraphQLString },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        dateCreated: { type: GraphQLNonNull(GraphQLString) },
        metrics: {
            type: GraphQLList(MetricType),
            resolve(parent, args) {
                return Metric.find({ user: parent.id })
            }
        },
        challenges: {
            type: GraphQLList(ChallengeType),
            resolve(parent, args) {
                return Challenge.find({ user: parent.id })
            }
        },
        diets: {
            type: GraphQLList(ChallengeType),
            resolve(parent, args) {
                return Diet.find({ user: parent.id })
            }
        },
        friends: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ friends: { $in: parent.id } })
            }
        },
        displayPicture: { type: GraphQLNonNull(GraphQLInt) },
        rewards: {
            type: GraphQLList(RewardType),
            resolve(parent, args) {
                return Reward.find({ user: parent.id })
            }
        },
        insurances: {
            type: GraphQLList(InsuranceType),
            resolve(parent, args) {
                return Insurance.find({ user: parent.id })
            }
        },
        offers: {
            type: GraphQLList(OfferType),
            resolve(parent, args) {
                return Offer.find({ user: parent.id })
            }
        },
        status: { type: GraphQLNonNull(GraphQLString) },
    })
})

const ChallengeType = new GraphQLObjectType({
    name: 'Challenge',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        user: {
            type: GraphQLNonNull(UserType),
            resolve (parent, args) {
                return User.findOne({challenges: {$in: parent.id}})
            }
        },
        from: {
            type: GraphQLNonNull(UserType),
            resolve(parent, args) {
                return User.findById(parent.from)
            }
        },
        to: {
            type: GraphQLNonNull(UserType),
            resolve(parent, args) {
                return User.findById(parent.to)
            }
        },
        date: {type: GraphQLNonNull(GraphQLString)},
        type: {type: GraphQLNonNull(GraphQLString)},
        value: {type: GraphQLNonNull(GraphQLString)},
        rewardBP: {type: GraphQLNonNull(GraphQLInt)},
        rewardHP: {type: GraphQLNonNull(GraphQLInt)},
        status: {type: GraphQLNonNull(GraphQLString)},
    })
})

const MetricType = new GraphQLObjectType({
    name: 'Metric',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        user: {
            type: GraphQLNonNull(UserType),
            resolve (parent, args) {
                return User.findOne({metrics: {$in: parent.id}})
            }
        },
        date: {type: GraphQLNonNull(GraphQLString)},
        bpm: {type: GraphQLFloat},
        calories: {type: GraphQLNonNull(GraphQLInt)},
        steps: {type: GraphQLNonNull(GraphQLInt)},
        diets: {
            type: GraphQLList(DietType),
            resolve(parent, args) {
                return Diet.find({metric: parent.id})
            }
        },
    })
})

const DietType = new GraphQLObjectType({
    name: 'Diet',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        user: {
            type: GraphQLNonNull(UserType),
            resolve (parent, args) {
                return User.findOne({diets: {$in: parent.id}})
            }
        },
        metric: {
            type: MetricType,
            // type: GraphQLNonNull(MetricType),
            resolve(parent, args) {
                Metric.findOne({diets: {$in: parent.id}})
            }
        },
        type: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLString},
        calorie: {type: GraphQLInt},
        quantity: {type: GraphQLInt},
        calorieSum: {type: GraphQLInt}
    })
})

const InsuranceType = new GraphQLObjectType({
    name: 'Insurance',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString)},
        description: { type: GraphQLNonNull(GraphQLString)},
        reqBP: { type: GraphQLNonNull(GraphQLInt)},
        users: { 
            type: GraphQLNonNull(GraphQLString),
            resolve(parent, args) {
                return User.find({insurances: {$in: parent.id}})
            }
        }
    })
})

const OfferType = new GraphQLObjectType({
    name: 'Offer',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString)},
        description: { type: GraphQLNonNull(GraphQLString)},
        reqHP: { type: GraphQLNonNull(GraphQLInt)},
        users: { 
            type: GraphQLNonNull(GraphQLString),
            resolve(parent, args) {
                return User.find({offers: {$in: parent.id}})
            }
        }
    })
})

const RewardType = new GraphQLObjectType({
    name: 'Reward',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        user: {
            type: GraphQLNonNull(UserType),
            resolve(parent, args) {
                return User.findOne({rewards: {$in: parent.id}})
            }
        },
        date: { type: GraphQLNonNull(GraphQLString)},
        addHP: { type: GraphQLNonNull(GraphQLInt)},
        addBP: { type: GraphQLNonNull(GraphQLInt)},
        challenge: {
            type: GraphQLNonNull(ChallengeType),
            resolve(parent, args) {
                return Challenge.findOne({reward: parent.id})
            }
        },
        status: { type: GraphQLNonNull(GraphQLString)}
    })
})

const AuthDataType = new GraphQLObjectType({
    name: 'AuthData',
    fields: () => ({
        userId: { type: GraphQLNonNull(GraphQLString) },
        userType: { type: GraphQLNonNull(GraphQLString) },
        token: { type: GraphQLNonNull(GraphQLString) },
        tokenExpiration: { type: GraphQLNonNull(GraphQLString) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        loginUser: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                method: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    const user = await User.findOne({ email: args.method })
                    if (!user) {
                        throw new Error('User does not exist')
                    }
                    const isEqual = await bcrypt.compare(args.password, user.password)
                    if (!isEqual) throw new Error('Invalid Password')
                    const token = jwt.sign({ userId: user.id, userType: 'User' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: user.id, token: token, userType: 'User', tokenExpiration: 8760 }
                }
                catch (err) {
                    console.log('Error loggin the User in: ', err)
                    return err
                }
            }
        },
        getUser: {
            type: GraphQLNonNull(UserType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await User.findById(req.userId)
                }
                catch (err) {
                    console.log('Error getting the User in: ', err)
                    return err
                }
            }
        },
        getUserById: {
            type: GraphQLNonNull(UserType),
            args: {
                userId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await User.findById(args.userId)
                }
                catch (err) {
                    console.log('Error getting the User By ID: ', err)
                    return err
                }
            }
        },
        getAllUsers: {
            type: GraphQLList(UserType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated or Unauthorized!')
                    return await User.find()
                }
                catch (err) {
                    console.log('Error getting the All Users: ', err)
                    return err
                }
            }
        },
        getOffers: {
            type: GraphQLList(OfferType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated or Unauthorized!')
                    return await Offer.find()
                }
                catch (err) {
                    console.log('Error getting the All Users: ', err)
                    return err
                }
            }
        },
        getInsurances: {
            type: GraphQLList(InsuranceType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated or Unauthorized!')
                    return await Insurance.find()
                }
                catch (err) {
                    console.log('Error getting the All Users: ', err)
                    return err
                }
            }
        }
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        createUser: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) },
                height: { type: GraphQLFloat },
                weight: { type: GraphQLFloat },
                gender: { type: GraphQLString },
                gToken: { type: GraphQLString },
                displayPicture: { type: GraphQLInt },
            },
            async resolve(parent, args) {
                try {
                    const user = await User.findOne({ email: args.email })
                    if (user) throw new Error('Email in use already')
                    var bmi = (args.height != null && args.weight != null) ? args.weight / (args.height * args.height) : null
                    const hashedPassword = await bcrypt.hash(args.password, 12)
                    const picture = args.displayPicture ? args.displayPicture : Math.floor(Math.random() * 8)
                    var newUser = new User({
                        name: args.name,
                        gToken: args.gToken,
                        email: args.email,
                        password: hashedPassword,
                        age: args.age,
                        bmi: bmi,
                        bp: 3000,
                        hp: 2500,
                        healthIndex: (args.height != null && args.weight != null) ? (100 - (10 * Math.abs(bmi - 21.5))) : null,
                        gender: args.gender ? args.gender : null,
                        height: args.height ? args.height : null,
                        weight: args.weight ? args.weight : null,
                        displayPicture: picture,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign({ userId: savedUser.id, userType: 'User' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: savedUser.id, token: token, userType: 'User', tokenExpiration: 8760 }
                }
                catch (err) {
                    console.log('Error creating a new user: ', err)
                    return err
                }
            }
        },
        addDiet: {
            type: GraphQLNonNull(DietType),
            args: {
                type: {type: GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLNonNull(GraphQLString)},
                quantity: {type: GraphQLNonNull(GraphQLInt)},
                calorie: {type: GraphQLNonNull(GraphQLInt)},
            },
            async resolve (parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated or Unauthorized!')
                    const diet = new Diet({
                        user: req.userId,
                        type: args.type,
                        name: args.name,
                        quantity: args.quantity,
                        calorie: args.calorie
                    })
                    const savedDiet = await diet.save()
                    await User.findOneAndUpdate(req.userId, {$push: {diets: savedDiet.id}})
                    return savedDiet
                }
                catch(err) {
                    console.log('Error adding a new diet point')
                    return err
                }
            }
        },
        createChallenge: {
            type: GraphQLNonNull(ChallengeType),
            args: {
                type: {type: GraphQLNonNull(GraphQLString)},
                value: {type: GraphQLNonNull(GraphQLString)}
            },
            async resolve (parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated or Unauthorized!')
                    var rewardHP, rewardBP
                    if(args.type == 'Steps') {
                        rewardHP = (parseInt(args.value) / 100) / 4
                        rewardBP = (parseInt(args.value) / 100) / 6
                    }
                    else {
                        var value = parseInt(args.value)
                        if(value == 2000) {
                            rewardHP = 10,
                            rewardBP = 15
                        }
                        else if (value == 2250) {
                            rewardHP = 8,
                            rewardBP = 10
                        }
                        else {
                            rewardHP = 4,
                            rewardBP = 5
                        }
                    }
                    const challenge = new Challenge({
                        date: Date().getTime(),
                        user: req.userId,
                        from: req.userId,
                        to: req.userId,
                        type: args.type,
                        rewardBP: rewardBP,
                        rewardHP: rewardHP,
                        value: args.value,
                        status: 'Alloted'
                    })
                    const savedChallenge = await challenge.save() 
                    await User.findByIdAndUpdate(req.userId, {$push: {challenges: savedChallenge.id}})
                    return savedChallenge
                }
                catch(err) {
                    console.log('Error creating a new challenge')
                    return err
                }
            }
        }
        // syncWithFit: {
        //     type: GraphQLList(MetricType),
        //     args: {
        //         accessToken: {type: GraphQLNonNull(GraphQLString)}
        //     },
        //     resolve (parent, args, req) {
        //         try {
        //             if(!req.userId) throw new Error('Unauthenticated')
        //             const userMetrics = Metric.find({user: parent.id})
        //             if(userMetrics.length == 0 || userMetrics[userMetrics.length].date )
        //         }
        //         catch(err) {
        //             console.log('Error Syncing with Google Fit: ', err)
        //             return err
        //         }
        //     }
        // }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})