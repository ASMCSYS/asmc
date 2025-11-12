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
import {
  useGetSingleActivity,
  useGetSingleEvent,
} from '../../hooks/useActivity.js';
import RenderHtml from 'react-native-render-html';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {defaultThumbnailEvent, frontendUrl} from '../../helpers/constants.js';
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

// Helper function to get registration status
const getRegistrationStatus = event => {
  if (!event.registration_start_date || !event.registration_end_date) {
    return {status: 'closed', text: 'Registration Closed', color: '#ff6b6b'};
  }

  const now = new Date();
  const startDate = new Date(event.registration_start_date);
  const endDate = new Date(event.registration_end_date);

  if (now < startDate) {
    return {
      status: 'upcoming',
      text: `Opens ${formatDate(event.registration_start_date)}`,
      color: '#4ecdc4',
    };
  } else if (now >= startDate && now <= endDate) {
    return {
      status: 'open',
      text: 'Registration Open',
      color: '#51cf66',
    };
  } else {
    return {
      status: 'closed',
      text: 'Registration Closed',
      color: '#ff6b6b',
    };
  }
};

// Helper function to check if event is upcoming
const isEventUpcoming = event => {
  if (!event.event_start_date) return false;
  const now = new Date();
  const eventDate = new Date(event.event_start_date);
  return eventDate > now;
};

const EventDetailContainer = ({route, navigate}) => {
  const {params} = route;
  const [isLoadingBrowser, setIsLoadingBrowser] = useState(false);
  const {data: eventData, isLoading} = useGetSingleEvent(params.event_id);

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!eventData?.result) {
    return (
      <View style={[styles.errorContainer]}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  const event = eventData.result;
  const registrationStatus = getRegistrationStatus(event);
  const isUpcoming = isEventUpcoming(event);

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
              {image: event?.images?.[0] || defaultThumbnailEvent},
              ...(event?.images?.map(image => ({image})) || []),
            ]}
            imageStyle={styles.activityImage}
            width={width}
            autoPlay
          />

          {/* Registration Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: registrationStatus.color},
            ]}>
            <Text style={styles.statusText}>{registrationStatus.text}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Event Title */}
          <Text style={styles.title}>{event.event_name}</Text>

          {/* Event Type and Member Type Badges */}
          <View style={styles.badgeContainer}>
            <View style={styles.eventTypeBadge}>
              <Ionicons name="trophy-outline" size={16} color="#1976d2" />
              <Text style={styles.eventTypeText}>
                {event.event_type || 'Event'}
              </Text>
            </View>
            {event.members_type && (
              <View style={styles.membersTypeBadge}>
                <Ionicons name="people-outline" size={16} color="#7b1fa2" />
                <Text style={styles.membersTypeText}>{event.members_type}</Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#e65100" />
            <Text style={styles.locationText}>
              {event.location_data?.title || event.location_data?.[0]?.title}
            </Text>
          </View>

          {/* Event Dates Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Event Schedule</Text>
            <View style={styles.dateCard}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Event Date</Text>
                  <Text style={styles.dateText}>
                    {formatDate(event.event_start_date)} -{' '}
                    {formatDate(event.event_end_date)}
                  </Text>
                </View>
              </View>
              <View style={styles.dateItem}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Event Time</Text>
                  <Text style={styles.dateText}>
                    {formatTime(event.event_start_time)} -{' '}
                    {formatTime(event.event_end_time)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Registration Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Registration Details</Text>
            <View style={styles.registrationCard}>
              <View style={styles.dateItem}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Registration Period</Text>
                  <Text style={styles.dateText}>
                    {formatDate(event.registration_start_date)} -{' '}
                    {formatDate(event.registration_end_date)}
                  </Text>
                </View>
              </View>
              <View style={styles.dateItem}>
                <Ionicons name="time-outline" size={18} color="#666" />
                <View style={styles.dateInfo}>
                  <Text style={styles.dateLabel}>Registration Time</Text>
                  <Text style={styles.dateText}>
                    {formatTime(event.registration_start_time)} -{' '}
                    {formatTime(event.registration_end_time)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Player Limits */}
          {(event.players_limit || event.min_players_limit) && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Player Requirements</Text>
              <View style={styles.limitsCard}>
                {event.players_limit && (
                  <View style={styles.limitItem}>
                    <Ionicons name="people-outline" size={18} color="#666" />
                    <View style={styles.limitInfo}>
                      <Text style={styles.limitLabel}>Maximum Players</Text>
                      <Text style={styles.limitText}>
                        {event.players_limit}
                      </Text>
                    </View>
                  </View>
                )}
                {event.min_players_limit && (
                  <View style={styles.limitItem}>
                    <Ionicons name="person-outline" size={18} color="#666" />
                    <View style={styles.limitInfo}>
                      <Text style={styles.limitLabel}>Minimum Players</Text>
                      <Text style={styles.limitText}>
                        {event.min_players_limit}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Categories Section */}
          {event.category_data && event.category_data.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Available Categories</Text>
              <View style={styles.categoriesCard}>
                {event.category_data.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>
                        {category.category_name}
                      </Text>
                      <View style={styles.ageBadge}>
                        <Text style={styles.ageText}>
                          {category.start_age}-{category.end_age} years
                        </Text>
                      </View>
                    </View>
                    <View style={styles.categoryDetails}>
                      <View style={styles.genderContainer}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.genderText}>
                          {category.gender?.join(', ') || 'All'}
                        </Text>
                      </View>
                      <View style={styles.pricingContainer}>
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Members</Text>
                          <Text style={styles.priceValue}>
                            ₹{category.members_fees}
                          </Text>
                        </View>
                        <View style={styles.priceItem}>
                          <Text style={styles.priceLabel}>Non-Members</Text>
                          <Text style={styles.priceValue}>
                            ₹{category.non_members_fees}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Team Event Pricing */}
          {(event.member_team_event_price ||
            event.non_member_team_event_price) && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Team Event Pricing</Text>
              <View style={styles.teamPricingCard}>
                {event.member_team_event_price && (
                  <View style={styles.teamPriceItem}>
                    <Ionicons name="card-outline" size={18} color="#666" />
                    <View style={styles.teamPriceInfo}>
                      <Text style={styles.teamPriceLabel}>
                        Member Team Price
                      </Text>
                      <Text style={styles.teamPriceValue}>
                        ₹{event.member_team_event_price}
                      </Text>
                    </View>
                  </View>
                )}
                {event.non_member_team_event_price && (
                  <View style={styles.teamPriceItem}>
                    <Ionicons name="card-outline" size={18} color="#666" />
                    <View style={styles.teamPriceInfo}>
                      <Text style={styles.teamPriceLabel}>
                        Non-Member Team Price
                      </Text>
                      <Text style={styles.teamPriceValue}>
                        ₹{event.non_member_team_event_price}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Short Description */}
          {event.description && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Event Overview</Text>
              <Text style={styles.shortDescription}>{event.description}</Text>
            </View>
          )}

          {/* Detailed Description */}
          {event.text_content && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              <View style={styles.descriptionContainer}>
                <RenderHtml
                  contentWidth={width - 64}
                  source={{html: event.text_content}}
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
                    h1: {
                      fontFamily: 'PlusJakartaSans-Bold',
                      fontSize: 24,
                      color: '#333',
                      marginTop: 8,
                      marginBottom: 4,
                    },
                    p: {
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 16,
                      color: '#555',
                      marginTop: 4,
                      marginBottom: 4,
                    },
                    h2: {
                      fontFamily: 'PlusJakartaSans-Bold',
                      fontSize: 22,
                      color: '#333',
                      marginTop: 8,
                      marginBottom: 4,
                    },
                    table: {
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 8,
                      marginVertical: 8,
                    },
                    th: {
                      backgroundColor: '#f8f9fa',
                      padding: 8,
                      fontFamily: 'PlusJakartaSans-Bold',
                      fontSize: 14,
                      color: '#333',
                    },
                    td: {
                      padding: 8,
                      fontFamily: 'PlusJakartaSans-Regular',
                      fontSize: 14,
                      color: '#555',
                    },
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Book Now Button */}
      {event.category_data && event.category_data.length > 0 && (
        <TouchableOpacity
          style={[
            styles.bookNowButton,
            isLoadingBrowser && styles.bookNowButtonDisabled,
          ]}
          onPress={async () => {
            const bookingUrl = `${frontendUrl}/events/booking/${event.event_id}`;

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
              <Text style={styles.bookNowText}>Book Now</Text>
            </>
          )}
        </TouchableOpacity>
      )}
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
  activityImage: {
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
    marginBottom: 20,
    gap: 12,
  },
  eventTypeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventTypeText: {
    color: '#1976d2',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  membersTypeBadge: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersTypeText: {
    color: '#7b1fa2',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
  },
  locationText: {
    fontSize: 16,
    color: '#e65100',
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Medium',
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
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registrationCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateInfo: {
    marginLeft: 12,
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  limitsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  limitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitInfo: {
    marginLeft: 12,
    flex: 1,
  },
  limitLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  limitText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  categoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1a1a1a',
    flex: 1,
  },
  ageBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ageText: {
    fontSize: 12,
    color: '#1976d2',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  categoryDetails: {
    gap: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  priceItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  teamPricingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamPriceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamPriceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  teamPriceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  teamPriceValue: {
    fontSize: 18,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  shortDescription: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
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
});

export default EventDetailContainer;
