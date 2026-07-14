const addressmodel = require("../Model/addressmodel");

async function addAddress(req, res) {
  try {
    const userId = req.user.id;
    const {
      fullname,
      phone,
      house,
      area,
      city,
      state,
      pincode,
      country,
      landmark,
      addresstype,
      isdefault,
    } = req.body;

    if (!fullname || !phone || !house || !area || !city || !state || !pincode) {
      return res.status(400).json({
        message: "fullname, phone, house, area, city, state and pincode are required",
      });
    }

    if (isdefault) {
      await addressmodel.updateMany({ user: userId }, { isdefault: false });
    }

    const existingCount = await addressmodel.countDocuments({ user: userId });

    const address = await addressmodel.create({
      user: userId,
      fullname,
      phone,
      house,
      area,
      city,
      state,
      pincode,
      country,
      landmark,
      addresstype,
      isdefault: existingCount === 0 ? true : !!isdefault,
    });

    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    console.log(error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

async function getAddresses(req, res) {
  try {
    const userId = req.user.id;
    const addresses = await addressmodel
      .find({ user: userId })
      .sort({ isdefault: -1, createdAt: -1 });

    res.status(200).json({ message: "User addresses", addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateAddress(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      fullname,
      phone,
      house,
      area,
      city,
      state,
      pincode,
      country,
      landmark,
      addresstype,
      isdefault,
    } = req.body;

    const address = await addressmodel.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isdefault) {
      await addressmodel.updateMany({ user: userId }, { isdefault: false });
    }

    if (fullname !== undefined) address.fullname = fullname;
    if (phone !== undefined) address.phone = phone;
    if (house !== undefined) address.house = house;
    if (area !== undefined) address.area = area;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (country !== undefined) address.country = country;
    if (landmark !== undefined) address.landmark = landmark;
    if (addresstype !== undefined) address.addresstype = addresstype;
    if (isdefault !== undefined) address.isdefault = isdefault;

    await address.save();

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    console.log(error);
    const statusCode = ["ValidationError", "CastError"].includes(error.name) ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

async function deleteAddress(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await addressmodel.findOneAndDelete({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.isdefault) {
      const nextAddress = await addressmodel
        .findOne({ user: userId })
        .sort({ createdAt: -1 });
      if (nextAddress) {
        nextAddress.isdefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log(error);
    const statusCode = error.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

async function setDefaultAddress(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await addressmodel.findOne({ _id: id, user: userId });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await addressmodel.updateMany({ user: userId }, { isdefault: false });
    address.isdefault = true;
    await address.save();

    res.status(200).json({ message: "Default address updated", address });
  } catch (error) {
    console.log(error);
    const statusCode = error.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

module.exports = {addAddress,getAddresses,updateAddress,deleteAddress,setDefaultAddress,};