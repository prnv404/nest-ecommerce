import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      ref: 'User',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);
