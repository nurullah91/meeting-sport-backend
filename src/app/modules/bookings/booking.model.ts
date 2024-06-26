import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  ],
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  totalAmount: { type: Number, required: true },
  isConfirmed: {
    type: String,
    enum: ['unconfirmed', 'confirmed'],
    default: 'unconfirmed',
  },
  isDeleted: { type: Boolean, default: false },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
