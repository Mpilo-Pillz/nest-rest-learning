import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });
  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('1234567890');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('1234567890', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('0123456789');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('0123456789', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
