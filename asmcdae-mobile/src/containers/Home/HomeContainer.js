import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import defaultStyles from '../../styles/styles.js';
import {useGetHomeBanner, useGetAppStats} from '../../hooks/useCommon.js';
import CarouselCards from '../../components/Home/CrouselCards.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useGetTopActivity} from '../../hooks/useActivity.js';
import LinearGradient from 'react-native-linear-gradient';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const HomeContainer = ({navigate}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);

  const {data, refetch: refetchBanners} = useGetHomeBanner();
  const {data: activityData, refetch: refetchActivities} = useGetTopActivity();
  const {
    data: appStats,
    refetch: refetchAppStats,
    isLoading: statsLoading,
  } = useGetAppStats();

  console.log('appStats:', appStats);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchBanners(),
      refetchActivities(),
      refetchAppStats(),
    ]);
    setRefreshing(false);
  };

  const imageData =
    data?.result?.result?.map(image => ({
      image: image.url,
    })) || [];

  // Animated header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  // Animated scale for cards
  const cardScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const renderFeatureCard = ({
    icon,
    title,
    subtitle,
    color,
    onPress,
    gradient,
  }) => (
    <TouchableOpacity
      style={styles.featureCard}
      onPress={onPress}
      activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        style={styles.featureGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.featureIconContainer}>{icon}</View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSubtitle}>{subtitle}</Text>
        <View style={styles.featureArrow}>
          <AntDesign
            name="arrowright"
            size={16}
            color="rgba(255,255,255,0.8)"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderActivityCard = (activity, index) => (
    <Animated.View
      key={activity._id}
      style={[
        styles.activityCard,
        {
          transform: [{scale: cardScale}],
        },
      ]}>
      <TouchableOpacity
        style={styles.activityCardTouchable}
        onPress={() =>
          navigate.navigate('ActivityDetail', {
            activity_id: activity.activity_id,
          })
        }
        activeOpacity={0.9}>
        <View style={styles.activityImageContainer}>
          <CarouselCards
            containerStyle={styles.activityCarousel}
            images={[
              {
                image: activity?.thumbnail,
                ...(activity?.images?.map(image => ({image})) || []),
              },
            ]}
            imageStyle={styles.activityImage}
            width={screenWidth - 32}
            autoPlay={true}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.activityOverlay}>
            <View style={styles.activityBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.activityBadgeText}>Featured</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle} numberOfLines={1}>
              {activity?.name}
            </Text>
            <View style={styles.activityRating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.activityRatingText}>4.8</Text>
            </View>
          </View>

          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity?.short_description}
          </Text>

          <View style={styles.activityFooter}>
            <View style={styles.activityTags}>
              <View style={styles.activityTag}>
                <Ionicons name="time-outline" size={12} color="#666" />
                <Text style={styles.activityTagText}>2 hours</Text>
              </View>
              <View style={styles.activityTag}>
                <Ionicons name="people-outline" size={12} color="#666" />
                <Text style={styles.activityTagText}>Max 20</Text>
              </View>
            </View>
            <View style={styles.activityPrice}>
              <Text style={styles.activityPriceText}>₹500</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }>
        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <CarouselCards
            images={imageData}
            containerStyle={styles.bannerCarousel}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>Discover Amazing Sports</Text>
            <Text style={styles.bannerSubtitle}>
              Join our community and stay active
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {renderFeatureCard({
              icon: <Ionicons name="football" size={28} color="#fff" />,
              title: 'Sports',
              subtitle: 'Activities & Training',
              gradient: ['#667eea', '#764ba2'],
              onPress: () => navigate.navigate('Activities'),
            })}
            {renderFeatureCard({
              icon: <FontAwesome5 name="calendar-alt" size={28} color="#fff" />,
              title: 'Events',
              subtitle: 'Tournaments & Competitions',
              gradient: ['#f093fb', '#f5576c'],
              onPress: () => navigate.navigate('Events'),
            })}
            {renderFeatureCard({
              icon: (
                <MaterialCommunityIcons name="school" size={28} color="#fff" />
              ),
              title: 'Halls',
              subtitle: 'Book Your Space',
              gradient: ['#4facfe', '#00f2fe'],
              onPress: () => navigate.navigate('Halls'),
            })}
            {renderFeatureCard({
              icon: <Ionicons name="trophy" size={28} color="#fff" />,
              title: 'Bookings',
              subtitle: 'My Reservations',
              gradient: ['#43e97b', '#38f9d7'],
              onPress: () => navigate.navigate('BookedActivity'),
            })}
          </View>
        </View>

        {/* Featured Activities */}
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Activities</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigate.navigate('Activities')}>
              <Text style={styles.viewAllText}>View All</Text>
              <AntDesign name="arrowright" size={16} color="#667eea" />
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesContainer}>
            {activityData?.result?.map((activity, index) =>
              renderActivityCard(activity, index),
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statsGradient}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {statsLoading
                    ? '...'
                    : appStats?.result?.totalActiveMembers ||
                      appStats?.totalActiveMembers ||
                      '0'}
                </Text>
                <Text style={styles.statLabel}>Active Members</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {statsLoading
                    ? '...'
                    : appStats?.result?.totalSportsActivities ||
                      appStats?.totalSportsActivities ||
                      '0'}
                </Text>
                <Text style={styles.statLabel}>Sports Activities</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {statsLoading
                    ? '...'
                    : appStats?.result?.totalHalls ||
                      appStats?.totalHalls ||
                      '0'}
                </Text>
                <Text style={styles.statLabel}>Event Halls</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Bold',
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  bannerContainer: {
    marginTop: 20,
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerCarousel: {
    borderRadius: 20,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerTitle: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'PlusJakartaSans-Bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1a1a2e',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: (screenWidth - 44) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  featureIconContainer: {
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureArrow: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  activitiesSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#667eea',
    marginRight: 4,
  },
  activitiesContainer: {
    gap: 16,
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
  },
  activityCardTouchable: {
    flex: 1,
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
  activityOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activityBadgeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#333',
    marginLeft: 4,
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
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#1a1a2e',
    flex: 1,
    marginRight: 8,
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
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTags: {
    flexDirection: 'row',
    gap: 8,
  },
  activityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityTagText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666',
    marginLeft: 4,
  },
  activityPrice: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityPriceText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#fff',
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statsGradient: {
    padding: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeContainer;
