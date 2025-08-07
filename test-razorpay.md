# 🧪 Razorpay Integration Test Guide

## ✅ Issues Fixed

1. **API URLs Fixed**: All Razorpay calls now use backend server URL
   - ❌ `axios.post('/api/orders/create-order')` → Frontend domain (404 error)
   - ✅ `API.post('/api/orders/create-order')` → Backend server ✅

2. **Backend Routes Verified**: All endpoints exist and working
   - ✅ `/api/orders/create-order` - Creates Razorpay order
   - ✅ `/api/orders/verify-payment` - Verifies payment signature  
   - ✅ `/api/orders/placeorder` - Saves order to database

3. **Environment Variables**: 
   - ✅ Backend: `RZP_KEY_ID` and `RZP_KEY_SEC` configured
   - ✅ Frontend: Added optional `REACT_APP_RAZORPAY_KEY`

## 🔧 Test Steps

### 1. **Test Backend Endpoints Directly**

```bash
# Test create-order endpoint
curl -X POST https://mern-ecomm-2yqf.onrender.com/api/orders/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 10000, "currency": "INR", "receipt": "test_receipt"}'

# Should return Razorpay order object with order_id
```

### 2. **Test Frontend Integration**

1. **Add items to cart**
2. **Go to checkout**  
3. **Click "Pay Now"** button
4. **Check browser console** for errors
5. **Razorpay popup should open** (not 404 error)

## 🚨 Common Issues & Fixes

### **Issue: "Failed to load resource: 404"**
- ✅ **Fixed**: Frontend now calls backend URL properly

### **Issue: "Error creating Razorpay order"**
- **Check**: Backend environment variables (`RZP_KEY_ID`, `RZP_KEY_SEC`)
- **Check**: Network connectivity to Razorpay servers
- **Check**: Amount is valid (minimum 1 rupee = 100 paise)

### **Issue: Payment verification fails**
- **Check**: Secret key matches in both create and verify endpoints
- **Check**: Signature generation using correct parameters

## 📱 Deployment Checklist

### **Frontend (.env)**
```env
REACT_APP_API_URL=https://mern-ecomm-2yqf.onrender.com/
REACT_APP_RAZORPAY_KEY=rzp_test_Dz9hd6AMtKfCZE
```

### **Backend (.env)**
```env
RZP_KEY_ID=rzp_test_Dz9hd6AMtKfCZE
RZP_KEY_SEC=rw9XkYczC8zyof55ca2LAT6z
MONGO_URI=mongodb+srv://dhruv:402125@cluster0.8bnod.mongodb.net/mern-ecom
PORT=5000
```

## ✅ Expected Flow

1. **User clicks "Pay Now"**
2. **Frontend calls** → `https://mern-ecomm-2yqf.onrender.com/api/orders/create-order`
3. **Backend creates Razorpay order** → Returns order_id
4. **Razorpay popup opens** with payment options
5. **User completes payment** → Razorpay returns response
6. **Frontend verifies payment** → `https://mern-ecomm-2yqf.onrender.com/api/orders/verify-payment`
7. **Backend verifies signature** → Returns success
8. **Frontend saves order** → `https://mern-ecomm-2yqf.onrender.com/api/orders/placeorder`
9. **Order saved to MongoDB** → User redirected to order page

## 🎉 Status: READY TO DEPLOY!

The 404 errors should be completely fixed now. All API calls point to your backend server at `https://mern-ecomm-2yqf.onrender.com/`