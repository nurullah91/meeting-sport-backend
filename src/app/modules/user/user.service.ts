import httpStatus from 'http-status';
import { IUser, TUserLogin } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { createToken } from './user.utils';
import config from '../../config';
import QueryBuilder from '../../../builder/QueryBuilder';

const createUserIntoDB = async (payload: IUser) => {
  const userInfo = { ...payload, role: 'user' };
  const result = User.create(userInfo);
  return result;
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const roomQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email', 'phone'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await roomQuery.countTotal();
  const result = await roomQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const loginUserWithEmail = async (payload: TUserLogin) => {
  // check user exist or not
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found !');
  }

  const matchPassword = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );

  if (!matchPassword) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password');
  }

  const jwtPayload = {
    email: user.email,
    phone: user.phone,
    role: user.role,
    userId: user._id,
  };
  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '1d',
  );
  // remove password before sent it to front end
  user.password = '';
  const result = {
    token: token,
    data: user,
  };
  return result;
};

const updateUserIntoDB = async (userId: string, payload: Partial<IUser>) => {
  const result = User.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  return result;
};

const deleteUserIntoDB = async (userId: string) => {
  const result = User.findByIdAndUpdate(
    userId,
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  return result;
};
export const UserServices = {
  getAllUserFromDB,
  createUserIntoDB,
  loginUserWithEmail,
  deleteUserIntoDB,
  updateUserIntoDB,
};
