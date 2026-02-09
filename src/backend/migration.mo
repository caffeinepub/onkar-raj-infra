import Map "mo:core/Map";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldAdminCredentials = {
    email : Text;
    passkey : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    products : Map.Map<Text, {
      id : Text;
      name : Text;
      diameterRange : Text;
      standards : Text;
      photo : ?Storage.ExternalBlob;
      price : ?Float;
      specifications : Text;
      available : Bool;
    }>;
    enquiries : Map.Map<Text, {
      id : Text;
      customerName : Text;
      phoneNumber : Text;
      email : Text;
      pipeDiameter : Text;
      quantity : Nat;
      requirementsFile : ?Storage.ExternalBlob;
      orderType : {
        #placeOrder;
        #requestQuote;
      };
      timestamp : Nat;
    }>;
    feedback : Map.Map<Text, {
      id : Text;
      name : Text;
      email : Text;
      phone : Text;
      subject : Text;
      message : Text;
      timestamp : Nat;
    }>;
    messages : Map.Map<Text, {
      id : Text;
      name : Text;
      email : Text;
      phone : Text;
      subject : Text;
      message : Text;
      timestamp : Nat;
    }>;
    siteSettings : {
      companyName : Text;
      contactDetails : Text;
      googleMapEmbed : Text;
      whatsappConfig : ?{
        phoneNumber : Text;
        prefilledMessage : ?Text;
      };
      pricingTable : [(Text, Float)];
      certifications : Text;
    };
    adminPasskey : Text;
    allowedAdminEmails : [Text];
    verifiedAdmins : Map.Map<Principal, Bool>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    products : Map.Map<Text, {
      id : Text;
      name : Text;
      diameterRange : Text;
      standards : Text;
      photo : ?Storage.ExternalBlob;
      price : ?Float;
      specifications : Text;
      available : Bool;
    }>;
    enquiries : Map.Map<Text, {
      id : Text;
      customerName : Text;
      phoneNumber : Text;
      email : Text;
      pipeDiameter : Text;
      quantity : Nat;
      requirementsFile : ?Storage.ExternalBlob;
      orderType : {
        #placeOrder;
        #requestQuote;
      };
      timestamp : Nat;
    }>;
    feedback : Map.Map<Text, {
      id : Text;
      name : Text;
      email : Text;
      phone : Text;
      subject : Text;
      message : Text;
      timestamp : Nat;
    }>;
    messages : Map.Map<Text, {
      id : Text;
      name : Text;
      email : Text;
      phone : Text;
      subject : Text;
      message : Text;
      timestamp : Nat;
    }>;
    siteSettings : {
      companyName : Text;
      contactDetails : Text;
      googleMapEmbed : Text;
      whatsappConfig : ?{
        phoneNumber : Text;
        prefilledMessage : ?Text;
      };
      pricingTable : [(Text, Float)];
      certifications : Text;
    };
    staticAdminPasskey : Text;
  };

  public func run(old : OldActor) : NewActor {
    let newPasskey = "Ved_ansh@04";
    let newUserProfiles = old.userProfiles;
    let newProducts = old.products;
    let newEnquiries = old.enquiries;
    let newFeedback = old.feedback;
    let newMessages = old.messages;
    let newSiteSettings = old.siteSettings;

    {
      userProfiles = newUserProfiles;
      products = newProducts;
      enquiries = newEnquiries;
      feedback = newFeedback;
      messages = newMessages;
      siteSettings = newSiteSettings;
      staticAdminPasskey = newPasskey;
    };
  };
};
