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
import {useGetHallsList} from '../../hooks/useActivity.js';
import {
  defaultPaginate,
  defaultThumbnailHall,
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

const HallsContainer = ({navigate}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [hallsList, setHallsList] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(defaultPaginate);

  const {
    isLoading,
    data: halls,
    isFetching,
    isError,
    refetch,
  } = useGetHallsList({
    ...pagination,
    sortBy: -1,
    sortField: 'createdAt',
  });

  useEffect(() => {
    setPagination(defaultPaginate);
  }, []);

  // Solution 1: Use useMemo to derive hallsList from cached data
  const processedHallsList = useMemo(() => {
    if (!halls?.result?.result) return [];

    // If this is the first page (pageNo === 0), return the results directly
    if (pagination.pageNo === 0) {
      return halls.result.result;
    }

    // For subsequent pages, we need to maintain the existing list
    // This will be handled by the useEffect below
    return hallsList;
  }, [halls?.result?.result, pagination.pageNo, hallsList]);

  useEffect(() => {
    if (halls?.result?.result) {
      // If this is the first page, reset the list
      if (pagination.pageNo === 0) {
        setHallsList(halls.result.result);
      } else {
        // For subsequent pages, append new halls without duplicates
        setHallsList(prevHalls => {
          const existingIds = new Set(prevHalls.map(hall => hall._id));
          const newHalls = halls.result.result.filter(
            hall => !existingIds.has(hall._id),
          );
          return [...prevHalls, ...newHalls];
        });
      }
    }
  }, [halls?.result?.result, pagination.pageNo]);

  // Solution 2: Force refetch when component mounts if we have cached data but empty local state
  useEffect(() => {
    if (
      halls?.result?.result &&
      hallsList.length === 0 &&
      pagination.pageNo === 0
    ) {
      setHallsList(halls.result.result);
    }
  }, [halls?.result?.result, hallsList.length, pagination.pageNo]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Reset pagination to first page
      setPagination({...defaultPaginate, keywords: searchKeyword});
      // Clear current list
      setHallsList([]);
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
    setHallsList([]); // Clear halls on search
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
    setHallsList([]); // Reset halls list
  };

  const fetchHalls = useCallback(() => {
    // Check if there are more pages to fetch based on total count and current page number
    const totalCount = halls?.result?.count || 0;
    const currentPage = Number(pagination.pageNo);
    const pageSize = Number(pagination.limit) || 10;

    // If there are still more results to fetch, proceed with pagination
    if (!isFetching && !isLoading && currentPage * pageSize < totalCount) {
      const nextPage = currentPage + 1; // Increment the page number
      setPagination({...pagination, pageNo: nextPage});
    }
  }, [pagination, isFetching, isLoading, halls]);

  const renderHall = useCallback(({item}) => {
    const hallStatus = getHallStatus(item);

    return (
      <TouchableOpacity
        style={styles.hallCard}
        key={item._id}
        onPress={() =>
          navigate.navigate('HallDetail', {hall_id: item.hall_id})
        }>
        <CarouselCards
          containerStyle={{marginBottom: 0}}
          images={[
            {image: item?.images?.[0] || defaultThumbnailHall},
            ...(item?.images?.map(image => ({image})) || []),
          ]}
          imageStyle={styles.hallImage}
          width={screenWidth - 32}
          autoPlay
        />

        {/* Hall Status Badge */}
        <View style={[styles.statusBadge, {backgroundColor: hallStatus.color}]}>
          <Text style={styles.statusText}>{hallStatus.text}</Text>
        </View>

        <View style={styles.hallContent}>
          <Text style={styles.hallTitle}>{item?.name}</Text>

          {/* Hall Type and Court Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.hallTypeBadge}>
              <Ionicons name="business-outline" size={16} color="#1976d2" />
              <Text style={styles.hallTypeText}>Hall</Text>
            </View>
            {item?.court && (
              <View style={styles.courtBadge}>
                <Ionicons name="location-outline" size={16} color="#7b1fa2" />
                <Text style={styles.courtText}>{item.court}</Text>
              </View>
            )}
          </View>

          {/* Location Information */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#e65100" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                {item.location_data?.title}
              </Text>
              {item.sublocation_data && (
                <Text style={styles.sublocationText}>
                  {item.sublocation_data.title}
                </Text>
              )}
            </View>
          </View>

          {/* Pricing Information */}
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingTitle}>Booking Charges</Text>
            <View style={styles.pricingGrid}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Booking Amount</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.booking_amount)}
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Advance Payment</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.advance_payment_amount)}
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Cleaning Charges</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.cleaning_charges)}
                </Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Refundable Deposit</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.refundable_deposit)}
                </Text>
              </View>
            </View>
          </View>

          {/* Additional Information */}
          <View style={styles.additionalInfoContainer}>
            {item.advance_booking_period && (
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.infoLabel}>Advance Booking:</Text>
                <Text style={styles.infoText}>
                  {item.advance_booking_period} days
                </Text>
              </View>
            )}
            {item.additional_charges && (
              <View style={styles.infoItem}>
                <Ionicons name="card-outline" size={16} color="#666" />
                <Text style={styles.infoLabel}>Additional Charges:</Text>
                <Text style={styles.infoText}>
                  {formatCurrency(item.additional_charges)}
                </Text>
              </View>
            )}
          </View>

          {/* Time Slots */}
          {item.time_slots && item.time_slots.length > 0 && (
            <View style={styles.timeSlotsContainer}>
              <Text style={styles.timeSlotsTitle}>Available Time Slots</Text>
              {item.time_slots.map((slot, index) => (
                <View key={index} style={styles.timeSlotItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.timeSlotText}>
                    {formatTime(slot.from)} - {formatTime(slot.to)}
                  </Text>
                </View>
              ))}
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

          {/* Capacity Information */}
          {item.description && item.description.includes('Capacity') && (
            <View style={styles.capacityContainer}>
              <Ionicons name="people-outline" size={16} color="#2e7d32" />
              <Text style={styles.capacityText}>
                {item.description.match(/Capacity.*?(\d+-\d+)/)?.[1] ||
                  'Capacity info available'}
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

  // Use the processed halls list for rendering
  const displayHallsList =
    hallsList.length > 0 ? hallsList : processedHallsList;

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
          placeholder="Search halls..."
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
        data={displayHallsList || []}
        keyExtractor={keyExtractor}
        renderItem={renderHall}
        contentContainerStyle={styles.hallsContainer}
        onEndReached={fetchHalls}
        onEndReachedThreshold={0.9}
        refreshControl={CustomRefreshControl}
        ListHeaderComponent={
          refreshing ? (
            <View style={styles.refreshHeader}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.refreshText}>Refreshing halls...</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading || isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading more halls...</Text>
            </View>
          ) : (
            halls?.result?.result?.length === 0 && (
              <Text style={styles.noDataText}>No more halls available</Text>
            )
          )
        }
        ListEmptyComponent={
          !isLoading &&
          !isFetching &&
          !displayHallsList?.length && (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={64} color="#ccc" />
              <Text style={styles.noDataText}>
                {isError ? 'Failed to load halls' : 'No halls found'}
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
    position: 'relative',
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
    zIndex: 1,
  },
  hallsContainer: {
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
  hallCard: {
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
  hallImage: {
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
  hallContent: {
    padding: 16,
  },
  hallTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  hallTypeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hallTypeText: {
    color: '#1976d2',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  courtBadge: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courtText: {
    color: '#7b1fa2',
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 12,
  },
  locationInfo: {
    marginLeft: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#e65100',
    fontFamily: 'PlusJakartaSans-Medium',
    marginBottom: 2,
  },
  sublocationText: {
    fontSize: 14,
    color: '#f57c00',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  pricingContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  pricingTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 12,
  },
  pricingGrid: {
    gap: 8,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  priceValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  additionalInfoContainer: {
    marginBottom: 16,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Medium',
    minWidth: 120,
  },
  infoText: {
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  timeSlotsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  timeSlotsTitle: {
    fontSize: 14,
    color: '#2e7d32',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 8,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timeSlotText: {
    fontSize: 14,
    color: '#388e3c',
    fontFamily: 'PlusJakartaSans-Regular',
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
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  capacityText: {
    fontSize: 14,
    color: '#2e7d32',
    fontFamily: 'PlusJakartaSans-Medium',
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

export default HallsContainer;
