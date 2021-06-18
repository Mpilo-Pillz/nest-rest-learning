// feature
class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendShip(name);
  }

  announceFriendShip(name) {
    console.log(`${name} is now a friend`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found!');
    }

    this.friends.splice(idx, 1);
  }
}

// tests
describe('my example test', () => {
  it('returns true', () => {
    expect(true).toEqual(true);
    expect(1 + 2).toEqual(3);
    expect('password').toEqual('password');
  });
});

describe('FriendsList', () => {
  let friendsList;
  beforeEach(() => {
    friendsList = new FriendsList();
  });
  it('initializes friends list', () => {
    // const friendsList = new FriendsList();
    expect(friendsList.friends.length).toEqual(0);
  });

  it('adds a friend to the list', () => {
    friendsList.addFriend('Fikz');
    friendsList.addFriend('Nikz');

    expect(friendsList.friends.length).toEqual(2);
  });

  it('announces FriendShip', () => {
    friendsList.announceFriendShip = jest.fn();
    expect(friendsList.announceFriendShip).not.toHaveBeenCalled();
    friendsList.addFriend('Thuz');
    expect(friendsList.announceFriendShip).toHaveBeenCalled();
    expect(friendsList.announceFriendShip).toHaveBeenCalledTimes(1);
    expect(friendsList.announceFriendShip).toHaveBeenCalledWith('Thuz');
  });

  describe('Another Describe becuase we have 2 outcomes from the method above', () => {
    it('removes a friend from the list', () => {
      friendsList.addFriend('Karz');
      expect(friendsList.friends[0]).toEqual('Karz');
      friendsList.removeFriend('Karz');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throws an error if a freind is not found on the array list', () => {
      expect(() => friendsList.removeFriend('Mpiz')).toThrow(
        new Error('Friend not found!'),
      );
    });
  });
});
