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
import {useGetActivityList} from '../../hooks/useActivity.js';
import {
  defaultPaginate,
  defaultThumbnailActivity,
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

// Helper function to get activity status
const getActivityStatus = activity => {
  if (!activity.status) {
    return {status: 'inactive', text: 'Inactive', color: '#ff6b6b'};
  }
  return {status: 'active', text: 'Active', color: '#51cf66'};
};

// Helper function to extract time from description
const extractTimeFromDescription = description => {
  if (!description) return null;

  // Look for time patterns like "7:00 AM" or "6:00 PM"
  const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))/g;
  const times = description.match(timePattern);

  if (times && times.length > 0) {
    // Return unique times
    return [...new Set(times)].slice(0, 3); // Limit to 3 times
  }

  return null;
};

// Helper function to extract location from description
const extractLocationFromDescription = description => {
  if (!description) return null;

  // Look for location patterns
  const locationPattern = /Location.*?:\s*([^<]+)/i;
  const match = description.match(locationPattern);

  if (match) {
    return match[1].trim();
  }

  return null;
};

// Helper function to extract fee from description
const extractFeeFromDescription = description => {
  if (!description) return null;

  // Look for fee patterns
  const feePattern = /Fee.*?:\s*([^<]+)/i;
  const match = description.match(feePattern);

  if (match) {
    return match[1].trim();
  }

  return null;
};

const ActivitiesContainer = ({navigate}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activitiesList, setActivitiesList] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(defaultPaginate);

  const {
    isLoading,
    data: activities,
    isFetching,
    isError,
    refetch,
  } = useGetActivityList({
    ...pagination,
    sortBy: 1,
    sortField: 'name',
    show_hide: true,
  });

  useEffect(() => {
    setPagination(defaultPaginate);
  }, []);

  // Solution 1: Use useMemo to derive activitiesList from cached data
  const processedActivitiesList = useMemo(() => {
    if (!activities?.result?.result) return [];

    // If this is the first page (pageNo === 0), return the results directly
    if (pagination.pageNo === 0) {
      return activities.result.result;
    }

    // For subsequent pages, we need to maintain the existing list
    // This will be handled by the useEffect below
    return activitiesList;
  }, [activities?.result?.result, pagination.pageNo, activitiesList]);

  useEffect(() => {
    if (activities?.result?.result) {
      // If this is the first page, reset the list
      if (pagination.pageNo === 0) {
        setActivitiesList(activities.result.result);
      } else {
        // For subsequent pages, append new activities without duplicates
        setActivitiesList(prevActivities => {
          const existingIds = new Set(
            prevActivities.map(activity => activity._id),
          );
          const newActivities = activities.result.result.filter(
            activity => !existingIds.has(activity._id),
          );
          return [...prevActivities, ...newActivities];
        });
      }
    }
  }, [activities?.result?.result, pagination.pageNo]);

  // Solution 2: Force refetch when component mounts if we have cached data but empty local state
  useEffect(() => {
    if (
      activities?.result?.result &&
      activitiesList.length === 0 &&
      pagination.pageNo === 0
    ) {
      setActivitiesList(activities.result.result);
    }
  }, [activities?.result?.result, activitiesList.length, pagination.pageNo]);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Reset pagination to first page
      setPagination({...defaultPaginate, keywords: searchKeyword});
      // Clear current list
      setActivitiesList([]);
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
    setActivitiesList([]); // Clear activities on search
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
    setActivitiesList([]); // Reset activities list
  };

  const fetchActivities = useCallback(() => {
    // Check if there are more pages to fetch based on total count and current page number
    const totalCount = activities?.result?.count || 0;
    const currentPage = Number(pagination.pageNo);
    const pageSize = Number(pagination.limit) || 10;

    // If there are still more results to fetch, proceed with pagination
    if (!isFetching && !isLoading && currentPage * pageSize < totalCount) {
      const nextPage = currentPage + 1; // Increment the page number
      setPagination({...pagination, pageNo: nextPage});
    }
  }, [pagination, isFetching, isLoading, activities]);

  const renderActivity = useCallback(({item}) => {
    const activityStatus = getActivityStatus(item);
    const times = extractTimeFromDescription(item.description);
    const location = extractLocationFromDescription(item.description);
    const fee = extractFeeFromDescription(item.description);

    return (
      <TouchableOpacity
        style={styles.activityCard}
        key={item._id}
        onPress={() =>
          navigate.navigate('ActivityDetail', {activity_id: item.activity_id})
        }
        activeOpacity={0.9}>
        <View style={styles.activityImageContainer}>
          <CarouselCards
            containerStyle={styles.activityCarousel}
            images={[
              {image: item?.thumbnail || defaultThumbnailActivity},
              ...(item?.images?.map(image => ({image})) || []),
            ]}
            imageStyle={styles.activityImage}
            width={screenWidth - 32}
            autoPlay
          />

          {/* Activity Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: activityStatus.color},
            ]}>
            <Ionicons
              name={
                activityStatus.status === 'active'
                  ? 'checkmark-circle'
                  : 'close-circle'
              }
              size={12}
              color="#fff"
            />
            <Text style={styles.statusText}>{activityStatus.text}</Text>
          </View>

          {/* Category Badge */}
          {item?.category && item.category.length > 0 && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {item.category[0]?.label || 'Activity'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.activityContent}>
          {/* Activity Header */}
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle} numberOfLines={1}>
              {item?.name}
            </Text>
            <View style={styles.activityRating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.activityRatingText}>4.8</Text>
            </View>
          </View>

          {/* Activity Description */}
          <Text style={styles.activityDescription} numberOfLines={2}>
            {item?.short_description}
          </Text>

          {/* Activity Details Grid */}
          <View style={styles.detailsGrid}>
            {/* Location */}
            {location && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            )}

            {/* Times */}
            {times && times.length > 0 && (
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {times[0]} {times.length > 1 && `+${times.length - 1} more`}
                </Text>
              </View>
            )}

            {/* Fee */}
            {fee && (
              <View style={styles.detailItem}>
                <Ionicons name="card-outline" size={16} color="#666" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {fee}
                </Text>
              </View>
            )}

            {/* Created Date */}
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                Added {formatDate(item?.createdAt)}
              </Text>
            </View>
          </View>

          {/* Activity Tags */}
          <View style={styles.tagsContainer}>
            {item?.category &&
              item.category.map((cat, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{cat.label}</Text>
                </View>
              ))}
            {item?.location &&
              item.location.map((loc, index) => (
                <View
                  key={`loc-${index}`}
                  style={[styles.tag, styles.locationTag]}>
                  <Text style={styles.locationTagText}>{loc.label}</Text>
                </View>
              ))}
          </View>

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

  // Use the processed activities list for rendering
  const displayActivitiesList =
    activitiesList.length > 0 ? activitiesList : processedActivitiesList;

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
          placeholder="Search activities..."
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
        data={displayActivitiesList || []}
        keyExtractor={keyExtractor}
        renderItem={renderActivity}
        contentContainerStyle={styles.activitiesContainer}
        onEndReached={fetchActivities}
        onEndReachedThreshold={0.9}
        refreshControl={CustomRefreshControl}
        ListHeaderComponent={
          refreshing ? (
            <View style={styles.refreshHeader}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.refreshText}>Refreshing activities...</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading || isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading more activities...</Text>
            </View>
          ) : (
            activities?.result?.result?.length === 0 && (
              <Text style={styles.noDataText}>
                No more activities available
              </Text>
            )
          )
        }
        ListEmptyComponent={
          !isLoading &&
          !isFetching &&
          !displayActivitiesList?.length && (
            <View style={styles.emptyContainer}>
              <Ionicons name="fitness-outline" size={64} color="#ccc" />
              <Text style={styles.noDataText}>
                {isError ? 'Failed to load activities' : 'No activities found'}
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
    backgroundColor: '#f8f9fa',
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
  activitiesContainer: {
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
  activityCard: {
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
  activityImageContainer: {
    position: 'relative',
  },
  activityCarousel: {
    marginBottom: 0,
  },
  activityImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
    marginLeft: 2,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#1976d2',
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  activityContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 24,
  },
  activityRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityRatingText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#f57c00',
    marginLeft: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  detailsGrid: {
    marginBottom: 16,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  locationTag: {
    backgroundColor: '#fff3e0',
  },
  locationTagText: {
    fontSize: 12,
    color: '#e65100',
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

export default ActivitiesContainer;
