import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ZoomIn } from "lucide-react";

interface Fabric {
  id: string;
  name: string;
  image_url: string;
  price_per_sqm: number;
  is_active?: boolean;
  group_name?: string;
}

interface FabricSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  fabrics: Fabric[];
  selectedFabricId: string;
  onSelect: (fabricId: string) => void;
}

export default function FabricSidePanel({ isOpen, onClose, fabrics, selectedFabricId, onSelect }: FabricSidePanelProps) {
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null);

  // Group fabrics by group_name or display as single items
  const groupedFabrics = useMemo(() => {
    const activeFabrics = fabrics?.filter((f) => f.is_active !== false) || [];
    const groups: { [key: string]: Fabric[] } = {};
    const result: {
      isGroup: boolean;
      groupName: string;
      variants: Fabric[];
      defaultFabric: Fabric;
    }[] = [];

    // Group fabrics
    activeFabrics.forEach((fabric) => {
      const gName = fabric.group_name?.trim();
      if (gName) {
        if (!groups[gName]) {
          groups[gName] = [];
        }
        groups[gName].push(fabric);
      } else {
        // Standalone fabric
        result.push({
          isGroup: false,
          groupName: fabric.name,
          variants: [fabric],
          defaultFabric: fabric,
        });
      }
    });

    // Add grouped items to the results list
    Object.entries(groups).forEach(([groupName, variants]) => {
      // Find if any variant in this group is currently selected
      const selectedVariant = variants.find((v) => v.id === selectedFabricId);
      result.push({
        isGroup: true,
        groupName,
        variants,
        defaultFabric: selectedVariant || variants[0],
      });
    });

    return result;
  }, [fabrics, selectedFabricId]);

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
            className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg md:max-w-xl bg-white z-50 shadow-2xl flex flex-col font-sans"
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
                Ürününüz için özel kumaş seçeneklerimizden birini belirleyin. Kumaş fiyatları ürünün metrekaresine göre fiyata eklenecektir. Görsellerin üzerindeki büyüteç simgesine tıklayarak kumaş dokusunu yakından inceleyebilirsiniz.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {groupedFabrics.map((item) => {
                  const activeFabric = item.defaultFabric;
                  const isSelected = item.variants.some((v) => v.id === selectedFabricId);
                  const isGroup = item.isGroup;
                  
                  return (
                    <div
                      key={isGroup ? `group-${item.groupName}` : `fabric-${activeFabric.id}`}
                      onClick={() => onSelect(activeFabric.id)}
                      className={`relative border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-md"
                          : "border-gray-200 hover:border-primary/50 bg-white hover:shadow-sm"
                      }`}
                    >
                      {/* Image Wrapper */}
                      <div className="w-full aspect-square relative bg-gray-100 overflow-hidden shrink-0">
                        {activeFabric.image_url ? (
                          <img
                            src={activeFabric.image_url}
                            alt={activeFabric.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Görsel Yok</div>
                        )}
                        
                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-white p-1.5 rounded-full shadow-sm z-10">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}

                        {/* Zoom Button */}
                        {activeFabric.image_url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the fabric
                              setZoomedImage({ url: activeFabric.image_url, name: activeFabric.name });
                            }}
                            className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/85 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
                            title="Yakınlaştır"
                          >
                            <ZoomIn size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>

                      {/* Info Area */}
                      <div className="p-3 pb-2 flex-1 flex flex-col justify-center text-center">
                        <h4 className={`font-semibold text-sm truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>
                          {activeFabric.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {activeFabric.price_per_sqm.toLocaleString('tr-TR')} $ / m²
                        </p>
                      </div>

                      {/* Swatches (Renk Daireleri) */}
                      {isGroup && (
                        <div className="p-3 pt-0 pb-3 flex flex-wrap gap-1.5 justify-center mt-auto border-t border-gray-100/50 pt-2">
                          {item.variants.map((variant) => {
                            const isVariantSelected = selectedFabricId === variant.id;
                            return (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation(); // Avoid card click conflicts
                                  onSelect(variant.id);
                                }}
                                className={`relative w-7 h-7 rounded-full overflow-hidden border transition-all ${
                                  isVariantSelected
                                    ? "ring-2 ring-primary border-transparent ring-offset-1 scale-110 z-10"
                                    : "border-gray-200 hover:border-primary/50 hover:scale-105"
                                }`}
                                title={variant.name}
                              >
                                {variant.image_url ? (
                                  <img
                                    src={variant.image_url}
                                    alt={variant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">
                                    ?
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={onClose}
                className="w-full py-4 bg-primary text-white uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors rounded-xl shadow-sm"
              >
                Seçimi Onayla
              </button>
            </div>
          </motion.div>

          {/* Zoom Modal (Lightbox) */}
          <AnimatePresence>
            {zoomedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomedImage(null)}
                className="fixed inset-0 bg-black/85 z-[60] flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="relative max-w-3xl w-full bg-transparent overflow-hidden rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={zoomedImage.url}
                    alt={zoomedImage.name}
                    className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-2xl mx-auto border border-white/10"
                  />
                  <div className="text-center mt-4 space-y-1">
                    <h3 className="text-white text-lg font-serif">{zoomedImage.name}</h3>
                    <button
                      onClick={() => setZoomedImage(null)}
                      className="text-white/60 hover:text-white text-xs uppercase tracking-widest border border-white/20 px-4 py-1.5 rounded-full hover:bg-white/10 transition-all"
                    >
                      KAPAT
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
