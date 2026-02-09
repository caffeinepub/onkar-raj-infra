import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  module Product {
    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };
  };

  module Enquiry {
    public func compareByTime(enquiry1 : Enquiry, enquiry2 : Enquiry) : Order.Order {
      Nat.compare(enquiry1.timestamp, enquiry2.timestamp);
    };
  };

  module Feedback {
    public func compareByTime(feedback1 : Feedback, feedback2 : Feedback) : Order.Order {
      Nat.compare(feedback1.timestamp, feedback2.timestamp);
    };
  };

  module Message {
    public func compareByTime(message1 : Message, message2 : Message) : Order.Order {
      Nat.compare(message1.timestamp, message2.timestamp);
    };
  };

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var products = Map.empty<Text, Product>();
  var enquiries = Map.empty<Text, Enquiry>();
  var feedback = Map.empty<Text, Feedback>();
  var messages = Map.empty<Text, Message>();
  var userProfiles = Map.empty<Principal, UserProfile>();

  var siteSettings : SiteSettings = {
    companyName = "Onkar Raj Infra";
    contactLocation = "Placeholder location";
    contactEmail = "contact@placeholder.com";
    contactPhone = "+911234567890";
    googleMapEmbed = "";
    whatsappConfig = null;
    pricingTable = [];
    certifications = "";
  };

  /////////////////////////////////////////////////////////////////////////////
  // Types
  /////////////////////////////////////////////////////////////////////////////

  public type UserProfile = {
    name : Text;
  };

  public type Product = {
    id : Text;
    name : Text;
    diameterRange : Text;
    standards : Text;
    photo : ?Storage.ExternalBlob;
    price : ?Float;
    specifications : Text;
    available : Bool;
  };

  public type Enquiry = {
    id : Text;
    customerName : Text;
    phoneNumber : Text;
    email : Text;
    pipeDiameter : Text;
    quantity : Nat;
    requirementsFile : ?Storage.ExternalBlob;
    orderType : OrderType;
    timestamp : Nat;
  };

  public type OrderType = {
    #placeOrder;
    #requestQuote;
  };

  public type Feedback = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Nat;
  };

  public type Message = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    subject : Text;
    message : Text;
    timestamp : Nat;
  };

  public type SiteSettings = {
    companyName : Text;
    contactLocation : Text;
    contactEmail : Text;
    contactPhone : Text;
    googleMapEmbed : Text;
    whatsappConfig : ?WhatsAppConfig;
    pricingTable : [(Text, Float)];
    certifications : Text;
  };

  public type WhatsAppConfig = {
    phoneNumber : Text;
    prefilledMessage : ?Text;
  };

  /////////////////////////////////////////////////////////////////////////////
  // User Profile Methods (using AccessControl for user management)
  /////////////////////////////////////////////////////////////////////////////
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Product Methods (admin-only)
  /////////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public query func getProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    let productsArray = products.toArray();
    productsArray.map(func((_, p)) { p });
  };

  /////////////////////////////////////////////////////////////////////////////
  // Enquiry Methods
  /////////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func submitEnquiry(enquiry : Enquiry) : async () {
    if (enquiry.phoneNumber.size() == 0) {
      Runtime.trap("Phone number is required");
    };
    if (enquiry.email.size() == 0) {
      Runtime.trap("Email address is required");
    };

    if (enquiry.quantity < 2000) {
      Runtime.trap("Order quantity must be at least 2000 meters");
    };

    enquiries.add(enquiry.id, enquiry);
  };

  public query ({ caller }) func getAllEnquiries() : async [Enquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all enquiries");
    };
    let enquiryIter = enquiries.values();
    let enquiryArray = enquiryIter.toArray();
    enquiryArray.sort(Enquiry.compareByTime).reverse();
  };

  /////////////////////////////////////////////////////////////////////////////
  // Feedback Methods
  /////////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func submitFeedback(feedbackData : Feedback) : async () {
    feedback.add(feedbackData.id, feedbackData);
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };
    let feedbackArray = feedback.values().toArray();
    feedbackArray.sort(Feedback.compareByTime).reverse();
  };

  /////////////////////////////////////////////////////////////////////////////
  // Message Methods
  /////////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func sendMessage(message : Message) : async () {
    messages.add(message.id, message);
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all messages");
    };
    let messagesArray = messages.values().toArray();
    messagesArray.sort(Message.compareByTime).reverse();
  };

  /////////////////////////////////////////////////////////////////////////////
  // Site Settings Methods
  /////////////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site settings");
    };
    siteSettings := settings;
  };

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  /////////////////////////////////////////////////////////////////////////////
  // Pricing Helper Methods
  /////////////////////////////////////////////////////////////////////////////
  public query func getPriceForDiameter(diameter : Text) : async ?Float {
    for ((d, p) in siteSettings.pricingTable.values()) {
      if (d == diameter) { return ?p };
    };
    null;
  };

  /// Grant admin access if correct passkey (from authenticated II user)
  public shared ({ caller }) func authenticateAdmin(passkey : Text) : async () {
    if (passkey != "vEDANSH468") {
      Runtime.trap("Invalid passkey");
    };
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
  };
};
