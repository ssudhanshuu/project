// inngest/index.js
const { Inngest } = require("inngest");
const UserActivation = require("../models/UserActivation");

// Initialize Inngest client
const inngest = new Inngest({ id: "movie-ticket-booking" });

// CREATE user
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };

    await UserActivation.create(userData);
  }
);

// UPDATE user
const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedData = {
      name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      image: image_url,
    };

    await UserActivation.findByIdAndUpdate(id, updatedData, { new: true, upsert: true });
  }
);

// DELETE user
const syncUserDelete = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await UserActivation.findByIdAndDelete(id);
  }
);

// ✅ CommonJS export
module.exports = {
  inngest,
  syncUserCreation,
  syncUserUpdate,
  syncUserDelete
};
