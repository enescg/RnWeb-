import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface Fabric {
  id: string;
  name: string;
  image_url: string;
  price_per_sqm: number;
}

interface FabricSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  fabrics: Fabric[];
  selectedFabricId: string;
  onSelect: (fabricId: string) => void;
}

export default function FabricSidePanel({ isOpen, onClose, fabrics, selectedFabricId, onSelect }: FabricSidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-serif text-gray-900">Kumaş Seçimi</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-sm text-gray-500 mb-6">
                Ürününüz için özel kumaş seçeneklerimizden birini belirleyin. Kumaş fiyatları ürünün metrekaresine göre fiyata eklenecektir.
              </p>
              
              <div className="space-y-4">
                {fabrics?.filter(f => f.is_active !== false).map((fabric) => {
                  const isSelected = selectedFabricId === fabric.id;
                  return (
                    <button
                      key={fabric.id}
                      onClick={() => onSelect(fabric.id)}
                      className={`w-full flex items-center p-4 border rounded-xl transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {fabric.image_url ? (
                          <img src={fabric.image_url} alt={fabric.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      
                      <div className="ml-4 flex-1 text-left">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className={`font-medium ${isSelected ? "text-primary" : "text-gray-900"}`}>
                            {fabric.name}
                          </h4>
                          {isSelected && <Check size={18} className="text-primary" />}
                        </div>
                        <p className="text-sm text-gray-500">
                          {fabric.price_per_sqm} ₺ / m²
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="w-full py-4 bg-primary text-white uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Seçimi Onayla
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
