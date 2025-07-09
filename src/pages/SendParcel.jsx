import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Package, MapPin, User, CheckCircle, X } from 'lucide-react';

const AddParcelForm = () => {
  const [showToast, setShowToast] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [formData, setFormData] = useState(null);

  // Get current user from Firebase Auth
  // const { user } = useAuth(); // Uncomment this in your actual implementation

  // Mock logged in user - replace with actual Firebase Auth user data
  const loggedInUser = {
    name: 'Code Slinger', // Firebase auth user.displayName
    email: 'codeslinger@example.com', // Firebase auth user.email
    id: 'user123', // Firebase auth user.uid
    phoneNumber: '+8801712345678', // Firebase auth user.phoneNumber (if available)
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      type: 'document',
      title: '',
      weight: '',
      senderName: loggedInUser.name, // Prefilled with logged in user's name
      senderContact: '',
      senderRegion: '',
      senderServiceCenter: '',
      senderAddress: '',
      pickupInstruction: '',
      receiverName: '',
      receiverContact: '',
      receiverRegion: '',
      receiverServiceCenter: '',
      receiverAddress: '',
      deliveryInstruction: '',
    },
  });

  const watchType = watch('type');
  const watchWeight = watch('weight');
  const watchSenderServiceCenter = watch('senderServiceCenter');
  const watchReceiverServiceCenter = watch('receiverServiceCenter');

  // Mock data for regions and service centers
  const regions = [
    { id: 'dhaka', name: 'Dhaka' },
    { id: 'chittagong', name: 'Chittagong' },
    { id: 'sylhet', name: 'Sylhet' },
    { id: 'rajshahi', name: 'Rajshahi' },
    { id: 'khulna', name: 'Khulna' },
  ];

  const serviceCenters = {
    dhaka: [
      { id: 'dhanmondi', name: 'Dhanmondi' },
      { id: 'gulshan', name: 'Gulshan' },
      { id: 'uttara', name: 'Uttara' },
    ],
    chittagong: [
      { id: 'agrabad', name: 'Agrabad' },
      { id: 'nasirabad', name: 'Nasirabad' },
    ],
    sylhet: [
      { id: 'zindabazar', name: 'Zindabazar' },
      { id: 'amberkhana', name: 'Amberkhana' },
    ],
    rajshahi: [
      { id: 'shaheb-bazar', name: 'Shaheb Bazar' },
      { id: 'boalia', name: 'Boalia' },
    ],
    khulna: [
      { id: 'sonadanga', name: 'Sonadanga' },
      { id: 'khalishpur', name: 'Khalishpur' },
    ],
  };

  // Calculate delivery cost based on new pricing structure
  const calculateCost = (type, senderCenter, receiverCenter, weight) => {
    if (!senderCenter || !receiverCenter) return 0;

    // Check if delivery is within same city/district
    const senderRegionKey = Object.keys(serviceCenters).find((region) =>
      serviceCenters[region].some((center) => center.id === senderCenter)
    );
    const receiverRegionKey = Object.keys(serviceCenters).find((region) =>
      serviceCenters[region].some((center) => center.id === receiverCenter)
    );

    const isWithinCity = senderRegionKey === receiverRegionKey;

    let cost = 0;

    if (type === 'document') {
      // Document pricing
      cost = isWithinCity ? 60 : 80;
    } else {
      // Non-document pricing
      const weightNum = parseFloat(weight) || 0;

      if (weightNum <= 3) {
        // Up to 3kg
        cost = isWithinCity ? 110 : 150;
      } else {
        // >3kg: base price + extra per kg
        const basePrice = isWithinCity ? 110 : 150;
        const extraWeight = weightNum - 3;
        const extraCharge = extraWeight * 40;
        const outsideCityExtra = isWithinCity ? 0 : 40; // Extra ৳40 for outside city >3kg

        cost = basePrice + extraCharge + outsideCityExtra;
      }
    }

    return cost;
  };

  const onSubmit = (data) => {
    const cost = calculateCost(
      data.type,
      data.senderServiceCenter,
      data.receiverServiceCenter,
      data.weight
    );
    setDeliveryCost(cost);
    setFormData(data);
    setShowToast(true);
  };

  const handleConfirm = () => {
    // Create comprehensive parcel data with all tracking information
    const parcelData = {
      // Parcel Basic Info
      id: `PKG-${Date.now()}`, // Generate unique parcel ID
      title: formData.title,
      type: formData.type,
      weight: formData.weight || null,

      // Sender Information
      sender: {
        name: formData.senderName,
        contact: formData.senderContact,
        email: loggedInUser.email, // Current user's email
        region: formData.senderRegion,
        serviceCenter: formData.senderServiceCenter,
        address: formData.senderAddress,
        pickupInstruction: formData.pickupInstruction,
      },

      // Receiver Information
      receiver: {
        name: formData.receiverName,
        contact: formData.receiverContact,
        region: formData.receiverRegion,
        serviceCenter: formData.receiverServiceCenter,
        address: formData.receiverAddress,
        deliveryInstruction: formData.deliveryInstruction,
      },

      // Cost Information
      pricing: {
        baseCost: calculateCostBreakdown().baseCost,
        extraCost: calculateCostBreakdown().extraCost,
        totalCost: deliveryCost,
        deliveryZone: calculateCostBreakdown().deliveryZone,
      },

      // Tracking & Status Information
      createdBy: loggedInUser.email, // Email of person creating the parcel
      createdAt: new Date().toISOString(), // ISO format for easy parsing
      createdAtTimestamp: Date.now(), // Timestamp for sorting
      status: 'pending_payment',
      trackingHistory: [
        {
          status: 'created',
          timestamp: new Date().toISOString(),
          description: 'Parcel created and waiting for payment',
          location: formData.senderRegion,
        },
      ],

      // Additional Tracking Data
      estimatedDelivery: calculateEstimatedDelivery(),
      deliveryType:
        calculateCostBreakdown().deliveryZone === 'Within City'
          ? 'local'
          : 'intercity',

      // Payment Information
      paymentStatus: 'pending',
      paymentMethod: null,
      paymentId: null,

      // System Information
      lastUpdated: new Date().toISOString(),
      version: 1,
    };

    console.log('Proceeding to payment with comprehensive data:', parcelData);

    // Reset form and close modal
    reset();
    setShowToast(false);
    setFormData(null);

    // Here you would redirect to payment page or show payment modal
    alert('Redirecting to payment page...');
  };

  const handleContinueShopping = () => {
    // Create comprehensive parcel data for saving without payment
    const parcelData = {
      // Parcel Basic Info
      id: `PKG-${Date.now()}`, // Generate unique parcel ID
      title: formData.title,
      type: formData.type,
      weight: formData.weight || null,

      // Sender Information
      sender: {
        name: formData.senderName,
        contact: formData.senderContact,
        email: loggedInUser.email, // Current user's email
        region: formData.senderRegion,
        serviceCenter: formData.senderServiceCenter,
        address: formData.senderAddress,
        pickupInstruction: formData.pickupInstruction,
      },

      // Receiver Information
      receiver: {
        name: formData.receiverName,
        contact: formData.receiverContact,
        region: formData.receiverRegion,
        serviceCenter: formData.receiverServiceCenter,
        address: formData.receiverAddress,
        deliveryInstruction: formData.deliveryInstruction,
      },

      // Cost Information
      pricing: {
        baseCost: calculateCostBreakdown().baseCost,
        extraCost: calculateCostBreakdown().extraCost,
        totalCost: deliveryCost,
        deliveryZone: calculateCostBreakdown().deliveryZone,
      },

      // Tracking & Status Information
      createdBy: loggedInUser.email, // Email of person creating the parcel
      createdAt: new Date().toISOString(), // ISO format for easy parsing
      createdAtTimestamp: Date.now(), // Timestamp for sorting
      status: 'draft',
      trackingHistory: [
        {
          status: 'draft',
          timestamp: new Date().toISOString(),
          description: 'Parcel created as draft - payment pending',
          location: formData.senderRegion,
        },
      ],

      // Additional Tracking Data
      estimatedDelivery: calculateEstimatedDelivery(),
      deliveryType:
        calculateCostBreakdown().deliveryZone === 'Within City'
          ? 'local'
          : 'intercity',

      // Payment Information
      paymentStatus: 'pending',
      paymentMethod: null,
      paymentId: null,

      // System Information
      lastUpdated: new Date().toISOString(),
      version: 1,
    };

    console.log('Saving parcel draft to database:', parcelData);

    // Reset form and close modal
    reset();
    setShowToast(false);
    setFormData(null);

    // Show success message
    alert(
      'Parcel saved as draft! You can continue shopping or proceed to payment later.'
    );
  };

  // Helper function to calculate estimated delivery
  const calculateEstimatedDelivery = () => {
    const now = new Date();
    const isWithinCity =
      calculateCostBreakdown().deliveryZone === 'Within City';

    // Add business days for delivery estimation
    const deliveryDays = isWithinCity ? 1 : 3; // 1 day for local, 3 days for intercity
    const estimatedDate = new Date(
      now.getTime() + deliveryDays * 24 * 60 * 60 * 1000
    );

    return estimatedDate.toISOString();
  };

  // Helper function to get cost breakdown (moved outside for reusability)
  const calculateCostBreakdown = () => {
    if (!formData)
      return { baseCost: 0, extraCost: 0, deliveryZone: '', breakdown: '' };

    const senderRegionKey = Object.keys(serviceCenters).find((region) =>
      serviceCenters[region].some(
        (center) => center.id === formData.senderServiceCenter
      )
    );
    const receiverRegionKey = Object.keys(serviceCenters).find((region) =>
      serviceCenters[region].some(
        (center) => center.id === formData.receiverServiceCenter
      )
    );

    const isWithinCity = senderRegionKey === receiverRegionKey;
    const deliveryZone = isWithinCity ? 'Within City' : 'Outside City/District';

    let baseCost = 0;
    let extraCost = 0;
    let breakdown = '';

    if (formData.type === 'document') {
      baseCost = isWithinCity ? 60 : 80;
      breakdown = `Document delivery ${deliveryZone.toLowerCase()}`;
    } else {
      const weightNum = parseFloat(formData.weight) || 0;

      if (weightNum <= 3) {
        baseCost = isWithinCity ? 110 : 150;
        breakdown = `Non-document up to 3kg (${deliveryZone.toLowerCase()})`;
      } else {
        baseCost = isWithinCity ? 110 : 150;
        const extraWeight = weightNum - 3;
        extraCost = extraWeight * 40;
        if (!isWithinCity) {
          extraCost += 40; // Extra ৳40 for outside city >3kg
        }
        breakdown = `Non-document >3kg: Base (${deliveryZone.toLowerCase()}) + ${extraWeight.toFixed(
          1
        )}kg extra${!isWithinCity ? ' + outside city charge' : ''}`;
      }
    }

    return { baseCost, extraCost, deliveryZone, breakdown };
  };

  const ConfirmationModal = ({
    show,
    onClose,
    cost,
    onProceedToPayment,
    onContinueShopping,
    formData,
  }) => {
    if (!show || !formData) return null;

    // Calculate cost breakdown
    const calculateCostBreakdown = () => {
      const senderRegionKey = Object.keys(serviceCenters).find((region) =>
        serviceCenters[region].some(
          (center) => center.id === formData.senderServiceCenter
        )
      );
      const receiverRegionKey = Object.keys(serviceCenters).find((region) =>
        serviceCenters[region].some(
          (center) => center.id === formData.receiverServiceCenter
        )
      );

      const isWithinCity = senderRegionKey === receiverRegionKey;
      const deliveryZone = isWithinCity
        ? 'Within City'
        : 'Outside City/District';

      let baseCost = 0;
      let extraCost = 0;
      let breakdown = '';

      if (formData.type === 'document') {
        baseCost = isWithinCity ? 60 : 80;
        breakdown = `Document delivery ${deliveryZone.toLowerCase()}`;
      } else {
        const weightNum = parseFloat(formData.weight) || 0;

        if (weightNum <= 3) {
          baseCost = isWithinCity ? 110 : 150;
          breakdown = `Non-document up to 3kg (${deliveryZone.toLowerCase()})`;
        } else {
          baseCost = isWithinCity ? 110 : 150;
          const extraWeight = weightNum - 3;
          extraCost = extraWeight * 40;
          if (!isWithinCity) {
            extraCost += 40; // Extra ৳40 for outside city >3kg
          }
          breakdown = `Non-document >3kg: Base (${deliveryZone.toLowerCase()}) + ${extraWeight.toFixed(
            1
          )}kg extra${!isWithinCity ? ' + outside city charge' : ''}`;
        }
      }

      return { baseCost, extraCost, deliveryZone, breakdown };
    };

    const { baseCost, extraCost, deliveryZone, breakdown } =
      calculateCostBreakdown();

    // Get region and service center names
    const getSenderLocation = () => {
      const region = regions.find((r) => r.id === formData.senderRegion);
      const serviceCenter = serviceCenters[formData.senderRegion]?.find(
        (sc) => sc.id === formData.senderServiceCenter
      );
      return `${region?.name || ''}, ${serviceCenter?.name || ''}`;
    };

    const getReceiverLocation = () => {
      const region = regions.find((r) => r.id === formData.receiverRegion);
      const serviceCenter = serviceCenters[formData.receiverRegion]?.find(
        (sc) => sc.id === formData.receiverServiceCenter
      );
      return `${region?.name || ''}, ${serviceCenter?.name || ''}`;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Confirm Parcel Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Parcel Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="text-blue-600" size={20} />
                Parcel Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">
                    {formData.type}
                  </span>
                </div>
                {formData.type === 'non-document' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">
                      {formData.weight || 'N/A'} kg
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Zone:</span>
                  <span className="font-medium text-blue-600">
                    {deliveryZone}
                  </span>
                </div>
              </div>
            </div>

            {/* Sender Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="text-green-600" size={20} />
                Sender Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.senderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{formData.senderContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{getSenderLocation()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right max-w-xs">
                    {formData.senderAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Receiver Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="text-orange-600" size={20} />
                Receiver Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">
                    {formData.receiverContact}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{getReceiverLocation()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right max-w-xs">
                    {formData.receiverAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Cost Breakdown
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{breakdown}:</span>
                    <span className="font-medium">৳{baseCost}</span>
                  </div>
                  {extraCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Extra charges:</span>
                      <span className="font-medium">৳{extraCost}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Cost:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ৳{cost}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onContinueShopping}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>
              <button
                onClick={onProceedToPayment}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add New Parcel
        </h1>
        <p className="text-gray-600">
          Fill in the details below to create a new door-to-door delivery parcel
        </p>
      </div>

      <div className="space-y-8">
        {/* Parcel Info Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="text-blue-600" size={20} />
            Parcel Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="document">Document</option>
                    <option value="non-document">Non-Document</option>
                  </select>
                )}
              />
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter parcel title"
                  />
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {watchType === 'non-document' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.1"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter weight in kg"
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sender Info Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="text-green-600" size={20} />
            Sender Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="senderName"
                control={control}
                rules={{ required: 'Sender name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                    readOnly
                  />
                )}
              />
              {errors.senderName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senderName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <Controller
                name="senderContact"
                control={control}
                rules={{ required: 'Contact is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.senderContact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senderContact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <Controller
                name="senderRegion"
                control={control}
                rules={{ required: 'Region is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.senderRegion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senderRegion.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Center <span className="text-red-500">*</span>
              </label>
              <Controller
                name="senderServiceCenter"
                control={control}
                rules={{ required: 'Service center is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Service Center</option>
                    {watch('senderRegion') &&
                      serviceCenters[watch('senderRegion')]?.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.senderServiceCenter && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senderServiceCenter.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <Controller
                name="senderAddress"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                )}
              />
              {errors.senderAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senderAddress.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Instruction <span className="text-red-500">*</span>
              </label>
              <Controller
                name="pickupInstruction"
                control={control}
                rules={{ required: 'Pickup instruction is required' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter pickup instructions"
                  />
                )}
              />
              {errors.pickupInstruction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupInstruction.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Info Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="text-orange-600" size={20} />
            Receiver Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="receiverName"
                control={control}
                rules={{ required: 'Receiver name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter receiver name"
                  />
                )}
              />
              {errors.receiverName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.receiverName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <Controller
                name="receiverContact"
                control={control}
                rules={{ required: 'Contact is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                )}
              />
              {errors.receiverContact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.receiverContact.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <Controller
                name="receiverRegion"
                control={control}
                rules={{ required: 'Region is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Region</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.receiverRegion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.receiverRegion.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Center <span className="text-red-500">*</span>
              </label>
              <Controller
                name="receiverServiceCenter"
                control={control}
                rules={{ required: 'Service center is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Service Center</option>
                    {watch('receiverRegion') &&
                      serviceCenters[watch('receiverRegion')]?.map((center) => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.receiverServiceCenter && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.receiverServiceCenter.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <Controller
                name="receiverAddress"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                )}
              />
              {errors.receiverAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.receiverAddress.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Instruction <span className="text-red-500">*</span>
              </label>
              <Controller
                name="deliveryInstruction"
                control={control}
                rules={{ required: 'Delivery instruction is required' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter delivery instructions"
                  />
                )}
              />
              {errors.deliveryInstruction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliveryInstruction.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Package size={20} />
            Calculate Cost & Submit
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showToast}
        cost={deliveryCost}
        formData={formData}
        onClose={() => setShowToast(false)}
        onProceedToPayment={handleConfirm}
        onContinueShopping={handleContinueShopping}
      />
    </div>
  );
};

export default AddParcelForm;
