import { X } from "lucide-react";

function RequestQuoteModal({
  quoteData,
  setQuoteData,
  onSubmit,
  onClose,
  inputClass,
  labelClass,
  modalPrimaryButton,
  modalCancelButton,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/75 px-3 py-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[4px] shadow-2xl">
        <div className="rounded-[24px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-blue-950">
                Request a Quote
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Submit your shipment details to receive a logistics quote.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-white"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Pickup City</label>
              <input
                type="text"
                value={quoteData.pickupCity}
                onChange={(e) =>
                  setQuoteData({ ...quoteData, pickupCity: e.target.value })
                }
                placeholder="Enter pickup city"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Delivery City</label>
              <input
                type="text"
                value={quoteData.deliveryCity}
                onChange={(e) =>
                  setQuoteData({ ...quoteData, deliveryCity: e.target.value })
                }
                placeholder="Enter delivery city"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Type of Goods</label>
              <select
                value={quoteData.goodsType}
                onChange={(e) =>
                  setQuoteData({ ...quoteData, goodsType: e.target.value })
                }
                className={inputClass}
                required
              >
                <option value="">Select goods type</option>
                <option value="Electronics">Electronics</option>
                <option value="Food">Food</option>
                <option value="Furniture">Furniture</option>
                <option value="Construction">Construction Materials</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Service Preference</label>
              <select
                value={quoteData.preferredService}
                onChange={(e) =>
                  setQuoteData({
                    ...quoteData,
                    preferredService: e.target.value,
                  })
                }
                className={inputClass}
                required
              >
                <option value="">Select service preference</option>
                <option value="Express">Express (1-2 days)</option>
                <option value="Standard">Standard (3-5 days)</option>
                <option value="Economy">Economy (5-7 days)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 border-t border-sky-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className={modalCancelButton}
              >
                Cancel
              </button>

              <button type="submit" className={modalPrimaryButton}>
                Submit Quote Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RequestQuoteModal;