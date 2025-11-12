import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import defaultStyles from '../../styles/styles.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CarouselCards from '../../components/Home/CrouselCards.js';
import {useGetEventsList} from '../../hooks/useActivity.js';
import {
  defaultPaginate,
  defaultThumbnailEvent,
} from '../../helpers/constants.js';
const {width: screenWidth} = Dimensions.get('window');

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

// Helper function to check if registration is open
const isRegistrationOpen = event => {
  if (!event.registration_start_date || !event.registration_end_date)
    return false;
  const now = new Date();
  const startDate = new Date(event.registration_start_date);
  const endDate = new Date(event.registration_end_date);
  return now >= startDate && now <= endDate;
};

// Helper function to check if event is upcoming
const isEventUpcoming = event => {
  if (!event.event_start_date) return false;
  const now = new Date();
  const eventDate = new Date(event.event_start_date);
  return eventDate > now;
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

const EventsContainer = ({navigate}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(defaultPaginate);

  const {
    isLoading,
    data: events,
    isFetching,
    isError,
    refetch,
  } = useGetEventsList({
    ...pagination,
    sortBy: -1,
    sortField: 'event_start_date',
    active: true,
  });

  useEffect(() => {
    setPagination(defaultPaginate);
  }, []);

  // Solution 1: Use useMemo to derive eventsList from cached data
  const processedEventsList = useMemo(() => {
    if (!events?.result?.result) return [];

    // If this is the first page (pageNo === 0), return the results directly
    if (pagination.pageNo === 0) {
      return events.result.result;
    }

    // For subsequent pages, we need to maintain the existing list
    // This will be handled by the useEffect below
    return eventsList;
  }, [events?.result?.result, pagination.pageNo, eventsList]);

  useEffect(() => {
    if (events?.result?.result) {
      // If this is the first page, reset the list
      if (pagination.pageNo === 0) {
        setEventsList(events.result.result);
      } else {
        // For subsequent pages, append new events without duplicates
        setEventsList(prevEvents => {
          const existingIds = new Set(prevEvents.map(event => event._id));
          const newEvents = events.result.result.filter(
            event => !existingIds.has(event._id),
          );
          return [...prevEvents, ...newEvents];
        });
      }
    }
  }, [events?.result?.result, pagination.pageNo]);

  // Solution 2: Force refetch when component mounts if we have cached data but empty local state
  useEffect(() => {
    if (
      events?.result?.result &&
      eventsList.length === 0 &&
      pagination.pageNo === 0
    ) {
      setEventsList(events.result.result);
    }
  }, [events?.result?.result, eventsList.length, pagination.pageNo]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Reset pagination to first page
      setPagination({...defaultPaginate, keywords: searchKeyword});
      // Clear current list
      setEventsList([]);
      // Refetch data
      await refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, searchKeyword]);

  const handleSearch = () => {
    setPagination({
      ...pagination,
      pageNo: 0,
      keywords: searchKeyword,
    });
    setEventsList([]); // Clear events on search
  };

  const handleSearchChange = text => {
    setSearchKeyword(text);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(
      setTimeout(() => {
        handleSearch(); // Call the search API after 2 seconds
      }, 2000),
    ); // 2000ms debounce time
  };

  const clearSearch = () => {
    setSearchKeyword(''); // Clear search input
    setPagination({...pagination, pageNo: 0, keywords: ''});
    setEventsList([]); // Reset events list
  };

  const fetchEvents = useCallback(() => {
    // Check if there are more pages to fetch based on total count and current page number
    const totalCount = events?.result?.count || 0;
    const currentPage = Number(pagination.pageNo);
    const pageSize = Number(pagination.limit) || 10;

    // If there are still more results to fetch, proceed with pagination
    if (!isFetching && !isLoading && currentPage * pageSize < totalCount) {
      const nextPage = currentPage + 1; // Increment the page number
      setPagination({...pagination, pageNo: nextPage});
    }
  }, [pagination, isFetching, isLoading, events]);

  const renderEvent = useCallback(({item}) => {
    const registrationStatus = getRegistrationStatus(item);
    const isUpcoming = isEventUpcoming(item);

    return (
      <TouchableOpacity
        style={styles.eventCard}
        key={item._id}
        onPress={() =>
          navigate.navigate('EventDetail', {event_id: item.event_id})
        }>
        <CarouselCards
          containerStyle={{marginBottom: 0}}
          images={[
            {image: item?.images?.[0] || defaultThumbnailEvent},
            ...(item?.images?.map(image => ({image})) || []),
          ]}
          imageStyle={styles.eventImage}
          width={screenWidth - 32}
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

        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item?.event_name}</Text>

          {/* Event Type Badge */}
          <View style={styles.eventTypeContainer}>
            <View style={styles.eventTypeBadge}>
              <Text style={styles.eventTypeText}>
                {item?.event_type || 'Event'}
              </Text>
            </View>
            {item?.members_type && (
              <View style={styles.membersTypeBadge}>
                <Text style={styles.membersTypeText}>{item?.members_type}</Text>
              </View>
            )}
          </View>

          {/* Event Dates */}
          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateLabel}>Event Date:</Text>
              <Text style={styles.dateText}>
                {formatDate(item?.event_start_date)} -{' '}
                {formatDate(item?.event_end_date)}
              </Text>
            </View>

            <View style={styles.dateItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.dateLabel}>Time:</Text>
              <Text style={styles.dateText}>
                {formatTime(item?.event_start_time)} -{' '}
                {formatTime(item?.event_end_time)}
              </Text>
            </View>
          </View>

          {/* Registration Dates */}
          <View style={styles.registrationContainer}>
            <Text style={styles.registrationTitle}>Registration Period</Text>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateLabel}>From:</Text>
              <Text style={styles.dateText}>
                {formatDate(item?.registration_start_date)}{' '}
                {formatTime(item?.registration_start_time)}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateLabel}>To:</Text>
              <Text style={styles.dateText}>
                {formatDate(item?.registration_end_date)}{' '}
                {formatTime(item?.registration_end_time)}
              </Text>
            </View>
          </View>

          {/* Location */}
          {item?.location_data && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>
                {item.location_data.title}
              </Text>
            </View>
          )}

          {/* Description */}
          {item?.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText} numberOfLines={3}>
                {item.description}
              </Text>
            </View>
          )}

          {/* Categories Info */}
          {item?.category_data && item.category_data.length > 0 && (
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesTitle}>Available Categories:</Text>
              <Text style={styles.categoriesText}>
                {item.category_data.length} category
                {item.category_data.length > 1 ? 's' : ''} available
              </Text>
            </View>
          )}

          {/* View Details Button */}
          <View style={styles.viewDetailsContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#007AFF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  // Use the processed events list for rendering
  const displayEventsList =
    eventsList.length > 0 ? eventsList : processedEventsList;

  // Custom refresh control component
  const CustomRefreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#007AFF"
      colors={['#007AFF']}
      progressBackgroundColor="#ffffff"
      title="Pull to refresh"
      titleColor="#007AFF"
      progressViewOffset={10}
    />
  );

  return (
    <View style={[defaultStyles.container, styles.container]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchKeyword}
          onChangeText={handleSearchChange}
        />
        {searchKeyword.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={24} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayEventsList || []}
        keyExtractor={keyExtractor}
        renderItem={renderEvent}
        contentContainerStyle={styles.eventsContainer}
        onEndReached={fetchEvents}
        onEndReachedThreshold={0.9}
        refreshControl={CustomRefreshControl}
        ListHeaderComponent={
          refreshing ? (
            <View style={styles.refreshHeader}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.refreshText}>Refreshing events...</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading || isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading more events...</Text>
            </View>
          ) : (
            events?.result?.result?.length === 0 && (
              <Text style={styles.noDataText}>No more events available</Text>
            )
          )
        }
        ListEmptyComponent={
          !isLoading &&
          !isFetching &&
          !displayEventsList?.length && (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.noDataText}>
                {isError ? 'Failed to load events' : 'No events found'}
              </Text>
              <Text style={styles.emptySubtext}>
                Pull down to refresh or try adjusting your search
              </Text>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    width: '100%',
  },
  searchInput: {
    height: 44,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    backgroundColor: '#f8f9fa',
  },
  clearIcon: {
    position: 'absolute',
    right: 25,
    top: 20,
  },
  eventsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  refreshHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginHorizontal: -16,
    marginTop: -12,
    marginBottom: 8,
  },
  refreshText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 24,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  eventTypeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    color: '#1976d2',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  membersTypeBadge: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membersTypeText: {
    color: '#7b1fa2',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  dateContainer: {
    marginBottom: 16,
    gap: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    minWidth: 60,
  },
  dateText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  registrationContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  registrationTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#e65100',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
  },
  categoriesContainer: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  categoriesTitle: {
    fontSize: 14,
    color: '#2e7d32',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 4,
  },
  categoriesText: {
    fontSize: 12,
    color: '#388e3c',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  viewDetailsText: {
    fontSize: 16,
    color: '#007AFF',
    fontFamily: 'PlusJakartaSans-Bold',
    marginRight: 4,
  },
  loadingContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
  },
});

export default EventsContainer;
