// import { updateEmailIdSearch } from '../controllers/UserController';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function addUser(email: string, passwordHash: string): Promise<User> {
  // Create the new user object
  let newUser = new User();
  newUser.email = email;
  newUser.passwordHash = passwordHash;

  // Then save it to the database
  // NOTES: We reassign to `newUser` so we can access
  // NOTES: the fields the database autogenerates (the id & default columns)
  newUser = await userRepository.save(newUser);

  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  return await userRepository.findOne({ where: { email } });
}

async function getUserById(id: string): Promise<User | null>{
  const user = await userRepository.findOne({
    select: {
      userId: true,
      email: true,
      verifiedEmail: true,
      profileViews: true
    },
    where:{
      userId: id
    }
  });
  return user;
}

// getViralUsers
async function allVerifiedUsers(): Promise<User[]>{
  const allVerifiedUsers = await userRepository.find({
    where: {
      verifiedEmail: true
    }
  });
  return allVerifiedUsers;
}

// all user data
async function allUserData(): Promise<User[]> {
  const allUsers = await userRepository.find();
  return allUsers;
}

// getUserByViews
async function getUsersByViews(minViews: number): Promise<User[]> {
  const users = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :minViews and verifiedEmail = true', { minViews }) // NOTES: the parameter `:minViews` must match the key name `minViews`
    .select(['user.email', 'user.profileViews', 'user.joinedOn', 'user.userId'])
    .getMany();

  return users;
}

async function updateEmail(userData: User, newEmail: string): Promise<User>{
  const updatedUser = userData;
  updatedUser.email = newEmail;

  await userRepository
  .createQueryBuilder()
  .update(User)
  .set({email: updatedUser.email})
  .where({ userId: updatedUser.userId})
  .execute();

  return updatedUser;
}

export { addUser, getUserByEmail, getUserById, getUsersByViews, allUserData, allVerifiedUsers, updateEmail };

/*
updating data
async function resetAllUnverifiedProfileViews(): Promise<void> { // change all users
  await userRepository
  .createQueryBuilder()
  .update(User)
  .set({profileViews: 0})
  .execute();
}

async function resetAllUnverifiedProfileViews(): Promise<void> { // change all unverified
  let usersChanged; // check docs
  usersChanged = await userRepository
  .createQueryBuilder()
  .update(User)
  .set({profileViews: 0})
  .where('unverified <> true')
  .execute();
}


*/
