module {
  type OldActor = {
    adminPasskey : Text;
    adminUnlockedState : Bool;
  };

  type NewActor = {};

  public func run(_ : OldActor) : NewActor {
    {};
  };
};
