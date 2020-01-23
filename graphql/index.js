const graphql = require('graphql')
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat } = graphql

const nexmo = require('nexmo')

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
        gender: { type: GraphQLString },
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
        friends: {
            type: GraphQLList(FriendType),
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

const SomethingType = new GraphQLObjectType({
    name: 'Something',
    fields: ({
        id: { type: GraphQLNonNull(GraphQLID) },

    })
})

const SomethingType = new GraphQLObjectType({
    name: 'Something',
    fields: ({
        id: { type: GraphQLNonNull(GraphQLID) },

    })
})

const SomethingType = new GraphQLObjectType({
    name: 'Something',
    fields: ({
        id: { type: GraphQLNonNull(GraphQLID) },

    })
})

const SomethingType = new GraphQLObjectType({
    name: 'Something',
    fields: ({
        id: { type: GraphQLNonNull(GraphQLID) },

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
                    const user = await User.findOne({
                        $or: [
                            { email: args.method },
                            { username: args.method },
                            { phoneNumber: args.method },
                        ]
                    })
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
        loginGymOwner: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                method: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    const gymOwner = await GymOwner.findOne({
                        $or: [
                            { email: args.method },
                            { phoneNumber: args.method },
                        ]
                    })
                    if (!gymOwner) {
                        throw new Error('GymOwner does not exist')
                    }
                    const isEqual = await bcrypt.compare(args.password, gymOwner.password)
                    if (!isEqual) throw new Error('Invalid Password')
                    const token = jwt.sign({ userId: gymOwner.id, userType: 'GymOwner' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: gymOwner.id, token: token, userType: 'GymOwner', tokenExpiration: 8760 }
                }
                catch (err) {
                    console.log('Error loggin the GymOwner in: ', err)
                    return err
                }
            }
        },
        loginAdmin: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                method: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    const admin = await Admin.findOne({
                        $or: [
                            { email: args.method },
                            { phoneNumber: args.method },
                        ]
                    })
                    if (!admin) {
                        throw new Error('User does not exist')
                    }
                    const isEqual = await bcrypt.compare(args.password, admin.password)
                    if (!isEqual) throw new Error('Invalid Password')
                    const token = jwt.sign({ userId: admin.id, userType: 'Admin' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: admin.id, token: token, userType: 'Admin', tokenExpiration: 8760 }
                }
                catch (err) {
                    console.log('Error loggin the Admin in: ', err)
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
                    if (!req.userType || req.userType != 'Admin') throw new Error('Unauthenticated or Unauthorized!')
                    return await User.find()
                }
                catch (err) {
                    console.log('Error getting the All Users: ', err)
                    return err
                }
            }
        },
        getGymOfUser: {
            type: GraphQLNonNull(GymType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Gym.findOne({ users: { $in: parent.id } })
                }
                catch (err) {
                    console.log('Error getting the User\'s Gym', err)
                    return err
                }
            }
        },
        getUserRequests: {
            type: GraphQLList(RequestType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Request.find({ user: req.userId })
                }
                catch (err) {
                    console.log('Error getting the User\'s Requests: ', err)
                    return err
                }
            }
        },
        getGymRequests: {
            type: GraphQLList(RequestType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Request.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting the Gym\'s Requests: ', err)
                    return err
                }
            }
        },
        getRequestById: {
            type: GraphQLNonNull(RequestType),
            args: {
                requestId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Request.findById(requestId)
                }
                catch (err) {
                    console.log('Error getting the request: ', err)
                    return err
                }
            }
        },
        getUserFeedbacks: {
            type: GraphQLList(RequestType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Feedback.find({ user: req.userId })
                }
                catch (err) {
                    console.log('Error getting the User\'s Feedbacks: ', err)
                    return err
                }
            }
        },
        getGymFeedbacks: {
            type: GraphQLList(RequestType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Feedback.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting the Gym\'s Feedbacks: ', err)
                    return err
                }
            }
        },
        getFeedbackById: {
            type: GraphQLNonNull(RequestType),
            args: {
                feedbackId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Feedback.findById(feedbackId)
                }
                catch (err) {
                    console.log('Error getting the feedback: ', err)
                    return err
                }
            }
        },
        getGymOfOwner: {
            type: GraphQLNonNull(GymType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return Gym.findOne({ owner: parent.id })
                }
                catch (err) {
                    console.log('Error getting the owner\'s Gym', err)
                    return err
                }
            }
        },
        getGymOwner: {
            type: GraphQLNonNull(GymOwnerType),
            async resolve(parent, args, req) {
                try {
                    console.log('GYMOWNER REQS: ', req.userId)
                    if (!req.userId) throw new Error('Unauthenticated')
                    return GymOwner.findById(req.userId)
                }
                catch (err) {
                    console.log('Error getting the GymOwner', err)
                    return err
                }
            }
        },
        getGymUsersByGymId: {
            type: GraphQLList(UserType),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) {
                        throw new Error('Unauthenticated!')
                    }
                    return await User.find({ gym: args.gymId })
                }
                catch (err) {
                    console.log('Error getting the Gym Users : ', err)
                    return err
                }
            }
        },
        getAllGyms: {
            type: GraphQLList(UserType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated or Unauthorized!')
                    return await Gym.find()
                }
                catch (err) {
                    console.log('Error getting All Gyms: ', err)
                    return err
                }
            }
        },
        getAllGymsOwners: {
            type: GraphQLList(GymOwnerType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated or Unauthorized!')
                    return await Gym.find()
                }
                catch (err) {
                    console.log('Error getting the All GymOwners: ', err)
                    return err
                }
            }
        },
        getPlanById: {
            type: GraphQLNonNull(PlanType),
            args: {
                planId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Plan.find({ gym: args.gymId })
                }
                catch (err) {
                    console.log('Error getting All Gym Plans: ', err)
                    return err
                }
            }
        },
        getGymPlansByGymId: {
            type: GraphQLList(PlanType),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Plan.find({ gym: args.gymId })
                }
                catch (err) {
                    console.log('Error getting All Gym Plans: ', err)
                    return err
                }
            }
        },
        getAllPlans: {
            type: GraphQLList(PlanType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated or Unauthorized!')
                    return await Plan.find()
                }
                catch (err) {
                    console.log('Error getting all plans: ', err)
                    return err
                }
            }
        },
        getUserInvoices: {
            type: GraphQLList(InvoiceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated')
                    return await Invoice.find({ user: req.userId })
                }
                catch (err) {
                    console.log('Error getting user invoices: ', err)
                    return err
                }
            }
        },
        getGymInvoices: {
            type: GraphQLList(InvoiceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Invoice.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting gym invoices: ', err)
                    return err
                }
            }
        },
        getAllInvoices: {
            type: GraphQLList(InvoiceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated & Unauthorized!')
                    return await Invoice.find()
                }
                catch (err) {
                    console.log('Error getting all invoices: ', err)
                    return err
                }
            }
        },
        getUserAttendance: {
            type: GraphQLList(AttendanceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Attendance.find({ user: req.userId })
                }
                catch (err) {
                    console.log('Error getting user attendance: ', err)
                    return err
                }
            }
        },
        getGymAttendance: {
            type: GraphQLList(AttendanceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Attendance.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting gym attendance: ', err)
                    return err
                }
            }
        },
        getAllAttendance: {
            type: GraphQLList(AttendanceType),
            async resolve(parent, args) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated & Unauthorized!')
                    return await Attendance.find()
                }
                catch (err) {
                    console.log('Error getting all attendance: ', err)
                    return err
                }
            }
        },
        getGymNotices: {
            type: GraphQLList(NoticeType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Notice.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting gym notices: ', err)
                    return err
                }
            }
        },
        getAllNotices: {
            type: GraphQLList(NoticeType),
            async resolve(parent, args) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated & Unauthorized!')
                    return await Notices.find()
                }
                catch (err) {
                    console.log('Error getting all notices: ', err)
                    return err
                }
            }
        },
        getGymNotifications: {
            type: GraphQLList(NotificationType),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Notifications.find({ gym: req.userId })
                }
                catch (err) {
                    console.log('Error getting gym notifications: ', err)
                    return err
                }
            }
        },
        getTrainersByGymId: {
            type: GraphQLList(TrainerType),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    return await Trainer.find({ gym: args.gymId })
                }
                catch (err) {
                    console.log('Error getting gym trainers: ', err)
                    return err
                }
            }
        },
        getAllTrainers: {
            type: GraphQLList(TrainerType),
            async resolve(parent, args) {
                try {
                    if (!req.userId || req.userType != 'Admin') throw new Error('Unauthenticated & Unauthorized!')
                    return await Trainer.find()
                }
                catch (err) {
                    console.log('Error getting all trainers: ', err)
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
                firstName: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) },
                gender: { type: GraphQLString },
                displayPicture: { type: GraphQLString },
                age: { type: GraphQLNonNull(GraphQLInt) },
                height: { type: GraphQLString },
                weight: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: args.email },
                            { username: args.username },
                            { phoneNumber: args.phoneNumber }
                        ]
                    })
                    if (user) {
                        if (user.username == user.username) throw new Error('Username in use already')
                        else if (user.phoneNumber == args.phoneNumber) throw new Error('Phone Number in use already')
                        else throw new Error('Email in use already')
                    }
                    const hashedPassword = await bcrypt.hash(args.password, 12)
                    const picture = args.displayPicture ? args.displayPicture : Math.floor(Math.random() * 8) + ''
                    // console.log(hashedPassword)
                    var newUser = new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        username: args.username,
                        password: hashedPassword,
                        address: args.address,
                        age: args.age,
                        gender: args.gender ? args.gender : 'U',
                        height: args.height ? args.height : null,
                        weight: args.weight ? args.weight : null,
                        displayPicture: picture,
                        phoneNumber: args.phoneNumber,
                        registerationFee: 0,
                        dateCreated: new Date().toDateString(),
                        dateLastLogin: new Date().toDateString(),
                        status: 'Active && No Gym'
                    })
                    const savedUser = await newUser.save()
                    const token = jwt.sign({ userId: savedUser.id, userType: 'User' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: savedUser.id, token: token, userType: 'User', tokenExpiration: 8760 }
                }
                catch (err) {
                    return err
                }
            }
        },
        addUserByGymOwner: {
            type: GraphQLNonNull(UserType),
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                gymId: { type: GraphQLNonNull(GraphQLString) },
                registerationFee: { type: GraphQLNonNull(GraphQLFloat) },
                due: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (!(req.userType != 'GymOwner' || req.userType == 'Admin')) throw new Error('Unauthorized!')
                    const addedUser = await User.findOneAndUpdate({ username: args.username }, { gym: args.gymId, registerationFee: args.registerationFee, due: args.due })
                    if (!addedUser) throw new Error('No such username')
                    await Gym.findByIdAndUpdate(args.gymId, { $push: { users: addedUser.id } })
                    return addedUser
                }
                catch (err) {
                    console.log('Error adding user to the gym through gym: ', err)
                    return err
                }
            }
        },
        createUserByGymOwner: {
            type: GraphQLNonNull(UserType),
            args: {
                firstName: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLString },
                address: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) },
                gender: { type: GraphQLString },
                age: { type: GraphQLNonNull(GraphQLInt) },
                due: { type: GraphQLNonNull(GraphQLString) },
                registerationFee: { type: GraphQLNonNull(GraphQLFloat) },
                height: { type: GraphQLString },
                weight: { type: GraphQLString },
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: args.email },
                            { username: args.username },
                            { phoneNumber: args.phoneNumber }
                        ]
                    })
                    if (user) {
                        if (user.username == user.username) throw new Error('Username in use already')
                        else if (user.phoneNumber == args.phoneNumber) throw new Error('Phone Number in use already')
                        else throw new Error('Email in use already')
                    }

                    // const nexmo = new Nexmo({
                    //     apiKey: '2c34eebc',
                    //     apiSecret: 'nOnsDwbM7RCK1aV7',
                    // })

                    // const from = 'Nexmo'
                    // const to = '91' + args.phoneNumber

                    const password = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8)
                    const hashedPassword = await bcrypt.hash(args.password == null ? password : args.password, 12)
                    const picture = args.displayPicture ? args.displayPicture : (await (Math.random() * 8) + '')
                    // const msgText = 'Hey there! Your gym has added you to EdzoFit, Kindly use the following Credentials to login to Edzo, Username(Email): ' + args.username + '(' + args.email + ') & OTP: ' + args.password;
                    // const phoneMsg = nexmo.message.sendSms(from, to, msgText)
                    // console.log(phoneMsg)
                    // console.log(hashedPassword)
                    var newUser = new User({
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        username: args.username,
                        password: hashedPassword,
                        address: args.address,
                        age: args.age,
                        gender: args.gender ? args.gender : 'null',
                        height: args.height ? args.height : null,
                        weight: args.weight ? args.weight : null,
                        displayPicture: picture,
                        phoneNumber: args.phoneNumber,
                        registerationFee: args.registerationFee,
                        due: args.due,
                        gym: args.gymId,
                        dateCreated: new Date().toDateString(),
                        dateLastLogin: new Date().toDateString(),
                        status: 'Active && No Plan'
                    })
                    const savedUser = await newUser.save()
                    return savedUser
                }
                catch (err) {
                    return err
                }
            }
        },
        createGymOwner: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLNonNull(GraphQLString) },
                city: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                const gymOwner = await GymOwner.findOne({
                    $or: [
                        { email: args.email },
                        { phoneNumber: args.phoneNumber }
                    ]
                })
                if (gymOwner) {
                    if (gymOwner.phoneNumber == args.phoneNumber) throw new Error('Phone Number in use already')
                    else throw new Error('Email in use already')
                }
                const hashedPassword = await bcrypt.hash(args.password, 12)
                const newGymOwner = new GymOwner({
                    name: args.name,
                    email: args.email,
                    password: hashedPassword,
                    address: args.address,
                    city: args.city,
                    phoneNumber: args.phoneNumber,
                    dateCreated: new Date().toDateString(),
                    dateLastLogin: new Date().toDateString(),
                    status: 'No Gym'
                })
                const savedGymOwner = await newGymOwner.save()
                const token = jwt.sign({ userId: savedGymOwner.id, userType: 'GymOwner' }, 'ninenine', {
                    expiresIn: '8760h'
                })
                return { userId: savedGymOwner.id, token: token, user: 'GymOwner', tokenExpiration: 8760 }
            }
        },
        createAdmin: {
            type: GraphQLNonNull(AuthDataType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    const admin = await Admin.findOne({
                        $or: [
                            { email: args.email },
                            { phoneNumber: args.phoneNumber }
                        ]
                    })
                    if (admin) {
                        if (admin.phoneNumber == args.phoneNumber) throw new Error('Phone Number in use already')
                        else throw new Error('Email in use already')
                    }
                    const hashedPassword = await bcrypt.hash(args.password, 12)
                    // console.log(hashedPassword)
                    var newUser = new User({
                        name: args.name,
                        email: args.email,
                        password: hashedPassword,
                        phoneNumber: args.phoneNumber,
                        dateCreated: new Date().toDateString(),
                        dateLastLogin: new Date().toDateString(),
                        status: 'Active'
                    })
                    const savedAdmin = await newAdmin.save()
                    const token = jwt.sign({ userId: savedAdmin.id, userType: 'Admin' }, 'ninenine', {
                        expiresIn: '8760h'
                    })
                    return { userId: savedAdmin.id, token: token, userType: 'Admin', tokenExpiration: 8760 }
                }
                catch (err) {
                    return err
                }
            }
        },
        createGym: {
            type: GraphQLNonNull(GymType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                address: { type: GraphQLNonNull(GraphQLString) },
                state: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) },
                GSTNumber: { type: GraphQLString }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    // const secondGym = await Gym.findOne({owner: req.userId})
                    // if(secondGym) throw new Error('Already has one Gym')
                    const gym = new Gym({
                        name: args.name,
                        address: args.address,
                        state: args.state,
                        owner: req.userId,
                        email: args.email,
                        color: Math.floor(Math.random() * 8),
                        phoneNumber: args.phoneNumber,
                        GSTNumber: args.GSTNumber ? args.GSTNumber : null,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    const savedGym = await gym.save()
                    await GymOwner.findByIdAndUpdate(req.userId, { $push: { gyms: savedGym.id }, status: 'Active' })
                    return savedGym
                }
                catch (err) {
                    console.log('Error creating a new gym: ', err)
                    return err
                }
            }
        },
        addGymPicsAndServicesByGymId: {
            type: GraphQLNonNull(GymType),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) },
                pictures: { type: GraphQLList(GraphQLString) },
                services: { type: GraphQLList(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner' || req.userType != 'Admin') throw new Error('Unauthorized!')
                    const oldGym = await Gym.findById(args.gymId)
                    return await Gym.findByIdAndUpdate(
                        args.gymId, {
                        pictures: args.pictures ? args.pictures : oldGym.pictures,
                        services: args.services ? args.services : oldGym.services
                    },
                        { new: true }
                    )
                }
                catch (err) {
                    console.log('Error adding pictures and services to the Gym: ', err)
                    return err
                }

            }
        },
        joinGym: {
            type: GraphQLNonNull(GymType),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    const secondGym = await Gym.findOne({ users: { $in: req.userId } })
                    if (secondGym) throw new Error('Already has one Gym')
                    const gym = await Gym.findByIdAndUpdate(args.gymId, { $push: { users: req.userId } }, { new: true })
                    await User.findByIdAndUpdate(req.userId, { gym: gym.id }, { new: true })
                    return gym
                }
                catch (err) {
                    console.log('Error joining the gym: ', err)
                    return err
                }
            }
        },
        leaveGym: {
            type: GraphQLNonNull(GraphQLString),
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    // Get User Info
                    const user = await User.findById(req.userId)
                    if (!user.gym) throw new Error('User has no gym to delete')
                    // Remove User from gym
                    await Gym.findByIdAndUpdate(user.gym, { $pull: { users: req.userId } })
                    // Remove User from plan
                    if (user.plan) await Plan.findByIdAndUpdate(user.plan, { $pull: { users: req.userId } })
                    // Remove User from trainer
                    if (user.trainer) await Trainer.findByIdAndUpdate(user.gym, { $pull: { users: req.userId } })
                    // Clear the User
                    await User.findByIdAndUpdate(req.userId, { gym: null, plan: null, registerationFee: 0, planCycleStart: null, trainer: null })
                    return 'Success'
                }
                catch (err) {
                    console.log('Error leaving the gym: ', err)
                    return err
                }
            }
        },
        deleteGymOfOwner: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const gym = await Gym.findById(args.gymId)
                    // Free the Users of the Gym
                    gym.users.map(async user => {
                        await User.findByIdAndUpdate(user, { gym: null, plan: null, registerationFee: 0, planCycleStart: null, trainer: null })
                    })
                    // Delete Trainers
                    gym.trainers.map(async trainer => {
                        await Trainer.findByIdAndDelete(trainer)
                    })
                    // Delete Plans
                    gym.plans.map(async plan => {
                        await Plan.findByIdAndDelete(plan)
                    })
                    // Free Owner
                    await GymOwner.findByIdAndUpdate(req.userId, { $pull: { gyms: args.gymId } })
                    // Update GymStatus
                    await Gym.findByIdAndUpdate(gym.id, { trainers: null, plans: null, users: null, status: 'ShutDown' })
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the gym: ', err)
                    return err
                }
            }
        },
        deleteGym: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'Admin') throw new Error('Unauthorized!')
                    const gym = await Gym.findById(args.gymId)
                    // Free the Users of the Gym
                    gym.users.map(async user => {
                        await User.findByIdAndUpdate(user, { gym: null, plan: null, registerationFee: 0, planCycleStart: null, trainer: null })
                    })
                    // Delete Trainers
                    gym.trainers.map(async trainer => {
                        await Trainer.findByIdAndDelete(trainer)
                    })
                    // Delete Plans
                    gym.plans.map(async plan => {
                        await Plan.findByIdAndDelete(plan)
                    })
                    // Free Owner
                    await GymOwner.findByIdAndUpdate(gym.owner, { gym: null })
                    // Update GymStatus
                    await Gym.findByIdAndUpdate(gym.id, { trainers: null, plans: null, users: null, status: 'ShutDown' })
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the gym: ', err)
                    return err
                }
            }
        },
        createPlan: {
            type: GraphQLNonNull(PlanType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                type: { type: GraphQLNonNull(GraphQLString) },
                // dateStarted: {type: GraphQLNonNull(GraphQLString)},
                description: { type: GraphQLNonNull(GraphQLString) },
                // amount: {type: GraphQLNonNull(GraphQLInt)},
                gymId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const plan = new Plan({
                        name: args.name,
                        gym: args.gymId,
                        type: args.type,
                        description: args.description,
                        // amount: args.amount,
                        // dateStarted: args.dateStarted,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    const savedPlan = await plan.save()
                    await Gym.findByIdAndUpdate(args.gymId, { $push: { plans: savedPlan.id } })
                    return savedPlan
                }
                catch (err) {
                    console.log('Error generating a new plan: ', err)
                    return err
                }
            }
        },
        joinPlan: {
            type: GraphQLNonNull(PlanType),
            args: {
                planId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await User.findOneAndUpdate(req.userId, { plan: planId })
                    const plan = await Plan.findByIdAndUpdate(args.planId, { $push: { users: req.userId } }, { new: true })
                    return plan
                }
                catch (err) {
                    console.log('Error joining the plan: ', err)
                    return err
                }
            }
        },
        leavePlan: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                planId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await User.findOneAndUpdate(req.userId, { plan: null })
                    await Plan.findByIdAndUpdate(args.planId, { $pull: { users: req.userId } }, { new: true })
                    return 'Success!'
                }
                catch (err) {
                    console.log('Error joining the plan: ', err)
                    return err
                }
            }
        },
        deletePlan: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                planId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    await Plan.findByIdAndDelete(args.planId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the plan: ', err)
                    return err
                }
            }
        },
        createTrainer: {
            type: GraphQLNonNull(TrainerType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const gymOwner = await GymOwner.findById(req.userId)
                    const trainer = new Trainer({
                        name: args.name,
                        gym: gymOwner.gym,
                        description: args.desciption,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    return await trainer.save()
                }
                catch (err) {
                    console.log('Error generating a new trainer: ', err)
                    return err
                }
            }
        },
        joinTrainer: {
            type: GraphQLNonNull(TrainerType),
            args: {
                trainerId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await User.findOneAndUpdate(req.userId, { trainer: trainerId })
                    const trainer = await Trainer.findByIdAndUpdate(args.trainerId, { $push: { users: req.userId } }, { new: true })
                    return trainer
                }
                catch (err) {
                    console.log('Error joining the trainer: ', err)
                    return err
                }
            }
        },
        leaveTrainer: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                trainerId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await User.findOneAndUpdate(req.userId, { trainer: null })
                    await Trainer.findByIdAndUpdate(args.trainerId, { $pull: { users: req.userId } }, { new: true })
                    return 'Success!'
                }
                catch (err) {
                    console.log('Error leaning the trainer: ', err)
                    return err
                }
            }
        },
        deleteTrainer: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                trainerId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    await Trainer.findByIdAndDelete(args.trainerId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the gym trainer: ', err)
                    return err
                }
            }
        },
        makePayment: {
            type: GraphQLNonNull(InvoiceType),
            args: {
                amount: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const invoice = new Invoice({
                        user: req.userId,
                        gym: user.gym,
                        plan: user.plan ? user.plan : null,
                        name: args.name,
                        desciption: args.desciption,
                        amount: args.amount,
                        dateCreated: new Date().toDateString(),
                        status: 'Paid'
                    })
                    return await invoice.save()
                }
                catch (err) {
                    console.log('Error making invoice: ', err)
                    return err
                }
            }
        },
        makePaymentByGymOwner: {
            type: GraphQLNonNull(InvoiceType),
            args: {
                amount: { type: GraphQLNonNull(GraphQLInt) },
                due: { type: GraphQLNonNull(GraphQLInt) },
                userId: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const invoice = new Invoice({
                        user: args.userId,
                        gym: user.gym,
                        plan: user.plan ? user.plan : null,
                        name: args.name,
                        desciption: args.desciption,
                        amount: args.amount,
                        dateCreated: new Date().toDateString(),
                        status: 'Paid'
                    })
                    const savedInvoice = await invoice.save()
                    await User.findByIdAndUpdate(args.userId, { due: args.due, $push: { invoices: savedInvoice.id } })
                    return savedInvoice
                }
                catch (err) {
                    console.log('Error making invoice: ', err)
                    return err
                }
            }
        },
        markAttendanceByGym: {
            type: GraphQLNonNull(AttendanceType),
            args: {
                userId: { type: GraphQLNonNull(GraphQLString) },
                gymId: { type: GraphQLNonNull(GraphQLString) },
                dateOverride: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const attendance = new Attendance({
                        user: args.userId,
                        gym: args.gymId,
                        date: args.dateOverride
                    })
                    const savedAttendance = await attendance.save()
                    await User.findByIdAndUpdate(args.userId, { $push: { attendances: savedAttendance.id } })
                    return savedAttendance
                }
                catch (err) {
                    console.log('Error marking attendance by gym: ', err)
                    return err
                }
            }
        },
        markAttendance: {
            type: GraphQLNonNull(AttendanceType),
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const attendance = new Attendance({
                        user: req.userId,
                        gym: user.gym,
                        date: new Date().toDateString()
                    })
                    return await attendance.save()
                }
                catch (err) {
                    console.log('Error marking attendance: ', err)
                    return err
                }
            }
        },
        createRequest: {
            type: GraphQLNonNull(RequestType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const request = new Request({
                        args: req.userId,
                        gym: user.gym,
                        name: args.name,
                        desciption: args.description,
                        dateCreated: new Date().toDateString(),
                        isOpen: true,
                        status: 'Active'
                    })
                    return await request.save()
                }
                catch (err) {
                    console.log('Error Creating a new feedback')
                }
            }
        },
        deleteRequest: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                requestId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await Request.findByIdAndDelete(args.requestId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the user request: ', err)
                    return err
                }
            }
        },
        replyRequest: {
            type: GraphQLNonNull(RequestType),
            args: {
                reply: { type: GraphQLNonNull(GraphQLString) },
                requestId: { type: GraphQLNonNull(GraphQLString) },
                affirmation: { type: GraphQLNonNull(GraphQLBoolean) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const modifiedRequest = await Request.findByIdAndUpdate(
                        args.requestId, {
                        reply: args.reply,
                        isOpen: false,
                        validated: args.affirmation,
                        responseAt: new Date().toDateString(),
                        status: 'Responded'
                    }, { new: true }
                    )
                    return modifiedRequest
                }
                catch (err) {
                    console.log('Error replying to user request: ', err)
                    return err
                }
            }
        },
        createFeedback: {
            type: GraphQLNonNull(FeedbackType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const feedback = new Feedback({
                        user: req.userId,
                        gym: user.gym,
                        name: args.name,
                        desciption: args.description,
                        dateCreated: new Date().toDateString(),
                        isOpen: true,
                        status: 'Active'
                    })
                    return await feedback.save()
                }
                catch (err) {
                    console.log('Error Creating a new feedback')
                }
            }
        },
        deleteFeedback: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                feedbackId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'User') throw new Error('Unauthorized!')
                    await Feedback.findByIdAndDelete(args.feedbackId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the user feedback: ', err)
                    return err
                }
            }
        },
        replyFeedback: {
            type: GraphQLNonNull(FeedbackType),
            args: {
                reply: { type: GraphQLNonNull(GraphQLString) },
                feedbackId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const modifiedFeedback = await Feedback.findByIdAndUpdate(args.feedbackId, { reply: args.reply }, { new: true })
                    return modifiedFeedback
                }
                catch (err) {
                    console.log('Error replying to user feedback: ', err)
                    return err
                }
            }
        },
        createNotificationForAllGymUsers: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    const gymOwner = await GymOwner.findById(req.userId)
                    const users = await Gym.findById(gymOwner.gym)
                    users.map(async user => {
                        var notification = new Notification({
                            user: user,
                            name: args.name,
                            description: args.desciption,
                            gym: gymOwner.gym,
                            dateCreated: new Date().toDateString(),
                            status: 'Active'
                        })
                        await notification.save()
                    })
                    return 'Success!'
                }
                catch (err) {
                    console.log('Error generating a new notification for all gym users: ', err)
                    return err
                }
            }
        },
        createNotificationForSpecificGymUser: {
            type: GraphQLNonNull(NotificationType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                userId: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner' || req.userType == 'Admin') throw new Error('Unauthorized!')
                    const gymOwner = await GymOwner.findById(req.userId)
                    const notification = new Notification({
                        user: user,
                        name: args.name,
                        description: args.desciption,
                        gym: gymOwner.gym,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    return await notification.save()
                }
                catch (err) {
                    console.log('Error generating a new notification for specific gym user: ', err)
                    return err
                }
            }
        },
        deleteNotification: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                notificationId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    await Notification.findByIdAndDelete(args.notificationId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the gym notification: ', err)
                    return err
                }
            }
        },
        createNotice: {
            type: GraphQLNonNull(NoticeType),
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GynOwner') throw new Error('Unauthorized!')
                    const user = await User.findById(req.userId)
                    const notice = new Notice({
                        name: args.name,
                        desciption: args.description,
                        gym: user.gym,
                        dateCreated: new Date().toDateString(),
                        status: 'Active'
                    })
                    return await notice.save()
                }
                catch (err) {
                    console.log('Error Creating a new notice: ', err)
                    return err
                }
            }
        },
        deleteNotice: {
            type: GraphQLNonNull(GraphQLString),
            args: {
                noticeId: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args, req) {
                try {
                    if (!req.userId) throw new Error('Unauthenticated!')
                    if (req.userType != 'GymOwner') throw new Error('Unauthorized!')
                    await Notice.findByIdAndDelete(args.noticeId)
                    return 'Success'
                }
                catch (err) {
                    console.log('Error deleting the gym notice: ', err)
                    return err
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})