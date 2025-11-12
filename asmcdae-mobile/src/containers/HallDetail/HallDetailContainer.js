import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import defaultStyles from '../../styles/styles.js';
import {useGetSingleHall} from '../../hooks/useActivity.js';
import RenderHtml from 'react-native-render-html';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {defaultThumbnailHall, frontendUrl} from '../../helpers/constants.js';
import CarouselCards from '../../components/Home/CrouselCards.js';

const {width} = Dimensions.get('window');

// Helper function to format date
const formatDate = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Helper function to format time
const formatTime = dateString => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function to format currency
const formatCurrency = amount => {
  if (!amount) return '₹0';
  return `₹${parseInt(amount).toLocaleString('en-IN')}`;
};

// Helper function to get hall status
const getHallStatus = hall => {
  if (!hall.status) {
    return {status: 'unavailable', text: 'Unavailable', color: '#ff6b6b'};
  }
  return {status: 'available', text: 'Available', color: '#51cf66'};
};

// Helper function to extract capacity from description
const extractCapacity = description => {
  if (!description) return null;
  const capacityMatch = description.match(/Capacity.*?(\d+-\d+)/);
  return capacityMatch ? capacityMatch[1] : null;
};

const HallDetailContainer = ({route, navigate}) => {
  const {params} = route;
  const [isLoadingBrowser, setIsLoadingBrowser] = useState(false);
  const {data: hallData, isLoading} = useGetSingleHall(params.hall_id);

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!hallData?.result) {
    return (
      <View style={[styles.errorContainer]}>
        <Text style={styles.errorText}>Hall not found.</Text>
      </View>
    );
  }

  const hall = hallData.result;
  const hallStatus = getHallStatus(hall);
  const capacity = extractCapacity(hall.description);

  return (
    <View style={[styles.container]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Images Slider */}
        <View style={styles.imageContainer}>
          <CarouselCards
            containerStyle={{marginBottom: 0}}
            images={[
              {image: hall?.images?.[0] || defaultThumbnailHall},
              ...(hall?.images?.map(image => ({image})) || []),
            ]}
            imageStyle={styles.hallImage}
            width={width}
            autoPlay
          />

          {/* Hall Status Badge */}
          <View
            style={[styles.statusBadge, {backgroundColor: hallStatus.color}]}>
            <Text style={styles.statusText}>{hallStatus.text}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Hall Title */}
          <Text style={styles.title}>{hall.name}</Text>

          {/* Hall Type and Court Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.hallTypeBadge}>
              <Ionicons name="business-outline" size={16} color="#1976d2" />
              <Text style={styles.hallTypeText}>Hall</Text>
            </View>
            {hall?.court && (
              <View style={styles.courtBadge}>
                <Ionicons name="location-outline" size={16} color="#7b1fa2" />
                <Text style={styles.courtText}>{hall.court}</Text>
              </View>
            )}
          </View>

          {/* Location Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location Details</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationItem}>
                <Ionicons name="location-outline" size={20} color="#e65100" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>Primary Location</Text>
                  <Text style={styles.locationText}>
                    {hall.location_data?.title}
                  </Text>
                </View>
              </View>
              {hall.sublocation_data && (
                <View style={styles.locationItem}>
                  <Ionicons name="business-outline" size={20} color="#f57c00" />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>Sub Location</Text>
                    <Text style={styles.locationText}>
                      {hall.sublocation_data.title}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Pricing Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Booking Charges</Text>
            <View style={styles.pricingCard}>
              <View style={styles.pricingGrid}>
                <View style={styles.priceItem}>
                  <Ionicons name="card-outline" size={18} color="#1976d2" />
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Booking Amount</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(hall.booking_amount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceItem}>
                  <Ionicons name="wallet-outline" size={18} color="#388e3c" />
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Advance Payment</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(hall.advance_payment_amount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceItem}>
                  <Ionicons name="brush-outline" size={18} color="#f57c00" />
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Cleaning Charges</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(hall.cleaning_charges)}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#7b1fa2"
                  />
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Refundable Deposit</Text>
                    <Text style={styles.priceValue}>
                      {formatCurrency(hall.refundable_deposit)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.additionalInfoCard}>
              {hall.advance_booking_period && (
                <View style={styles.infoItem}>
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Advance Booking Period</Text>
                    <Text style={styles.infoText}>
                      {hall.advance_booking_period} days
                    </Text>
                  </View>
                </View>
              )}
              {hall.additional_charges && (
                <View style={styles.infoItem}>
                  <Ionicons name="add-circle-outline" size={18} color="#666" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Additional Charges</Text>
                    <Text style={styles.infoText}>
                      {formatCurrency(hall.additional_charges)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Time Slots */}
          {hall.time_slots && hall.time_slots.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              <View style={styles.timeSlotsCard}>
                {hall.time_slots.map((slot, index) => (
                  <View key={index} style={styles.timeSlotItem}>
                    <Ionicons name="time-outline" size={18} color="#2e7d32" />
                    <View style={styles.timeSlotInfo}>
                      <Text style={styles.timeSlotLabel}>
                        Time Slot {index + 1}
                      </Text>
                      <Text style={styles.timeSlotText}>
                        {formatTime(slot.from)} - {formatTime(slot.to)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Capacity Information */}
          {capacity && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Capacity</Text>
              <View style={styles.capacityCard}>
                <Ionicons name="people-outline" size={24} color="#2e7d32" />
                <View style={styles.capacityInfo}>
                  <Text style={styles.capacityLabel}>Maximum Capacity</Text>
                  <Text style={styles.capacityText}>{capacity} persons</Text>
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          {hall?.description && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hall Overview</Text>
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText}>{hall.description}</Text>
              </View>
            </View>
          )}

          {/* Terms and Conditions */}
          {hall?.terms && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
              <View style={styles.termsCard}>
                <RenderHtml
                  contentWidth={width - 64}
                  source={{html: hall.terms}}
                  systemFonts={[
                    'PlusJakartaSans-Regular',
                    'PlusJakartaSans-Bold',
                  ]}
                  tagsStyles={{
                    body: {
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 16,
                      color: '#555',
                      margin: 0,
                      padding: 0,
                    },
                    p: {
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 16,
                      color: '#555',
                      marginTop: 4,
                      marginBottom: 4,
                      lineHeight: 24,
                    },
                    strong: {
                      fontFamily: 'PlusJakartaSans-Bold',
                      color: '#333',
                    },
                    br: {
                      marginBottom: 8,
                    },
                  }}
                />
              </View>
            </View>
          )}

          {/* Detailed Content */}
          {hall?.text_content && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Additional Details</Text>
              <View style={styles.detailedContentCard}>
                <RenderHtml
                  contentWidth={width - 64}
                  source={{html: hall.text_content}}
                  systemFonts={[
                    'PlusJakartaSans-Regular',
                    'PlusJakartaSans-Bold',
                  ]}
                  tagsStyles={{
                    body: {
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 16,
                      color: '#555',
                      margin: 0,
                      padding: 0,
                    },
                    p: {
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 16,
                      color: '#555',
                      marginTop: 4,
                      marginBottom: 4,
                      lineHeight: 24,
                    },
                    strong: {
                      fontFamily: 'PlusJakartaSans-Bold',
                      color: '#333',
                    },
                  }}
                />
              </View>
            </View>
          )}

          {/* Bottom spacing for floating button */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Floating Book Now Button */}
      <TouchableOpacity
        style={[
          styles.bookNowButton,
          isLoadingBrowser && styles.bookNowButtonDisabled,
        ]}
        onPress={async () => {
          const bookingUrl = `${frontendUrl}/booking/hall-booking/${hall.hall_id}`;

          navigate.navigate('WebView', {
            url: bookingUrl,
          });
        }}
        disabled={isLoadingBrowser}>
        {isLoadingBrowser ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#fff"
              style={{marginRight: 8}}
            />
            <Text style={styles.bookNowText}>Book Hall</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
  },
  hallImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 32,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  hallTypeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hallTypeText: {
    color: '#1976d2',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  courtBadge: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courtText: {
    color: '#7b1fa2',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pricingGrid: {
    gap: 12,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  additionalInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  timeSlotsCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeSlotInfo: {
    marginLeft: 12,
    flex: 1,
  },
  timeSlotLabel: {
    fontSize: 14,
    color: '#2e7d32',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#388e3c',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  capacityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  capacityLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  capacityText: {
    fontSize: 18,
    color: '#2e7d32',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 24,
  },
  termsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailedContentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookNowButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookNowButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookNowText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HallDetailContainer;
