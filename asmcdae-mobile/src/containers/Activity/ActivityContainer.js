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
import {useGetSingleActivity} from '../../hooks/useActivity.js';
import RenderHtml from 'react-native-render-html';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  defaultThumbnailActivity,
  frontendUrl,
} from '../../helpers/constants.js';
import CarouselCards from '../../components/Home/CrouselCards.js';

const {width} = Dimensions.get('window');

const ActivityContainer = ({route, navigate}) => {
  const {params} = route;
  const [isLoadingBrowser, setIsLoadingBrowser] = useState(false);
  const {data: activityData, isLoading} = useGetSingleActivity(
    params.activity_id,
  );
  if (isLoading) {
    return (
      <View style={[styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!activityData?.result) {
    return (
      <View style={[styles.errorContainer]}>
        <Text style={styles.errorText}>Activity not found.</Text>
      </View>
    );
  }

  const activity = activityData.result;

  return (
    <View style={[styles.container]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Images Slider */}
        <CarouselCards
          containerStyle={{marginBottom: 0}}
          images={[
            {image: activity?.thumbnail || defaultThumbnailActivity},
            ...(activity?.images?.map(image => ({image})) || []),
          ]}
          imageStyle={styles.activityImage}
          width={width}
          autoPlay
        />

        {/* Activity Title */}
        <Text style={styles.title}>{activity.name}</Text>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#555" />
          <Text style={styles.locationText}>
            {activity.location.map(loc => loc.label).join(', ')}
          </Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {activity.category.map((cat, index) => (
            <Text key={index} style={styles.categoryBadge}>
              {cat.label}
            </Text>
          ))}
        </View>

        {/* Short Description */}
        <Text style={styles.shortDescription}>
          {activity.short_description}
        </Text>

        {/* Detailed Description */}
        <View style={styles.descriptionContainer}>
          <RenderHtml
            contentWidth={width - 32}
            source={{html: activity.description}}
            systemFonts={['PlusJakartaSans-Regular', 'PlusJakartaSans-Bold']}
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
                marginBottom: 4, // Adjust this to reduce space
              },
              p: {
                fontFamily: 'PlusJakartaSans-Regular',
                fontSize: 16,
                color: '#555',
                marginTop: 4,
                marginBottom: 4, // Adjust this to reduce space
              },
              h2: {
                fontFamily: 'PlusJakartaSans-Bold',
                fontSize: 22,
                color: '#333',
                marginTop: 8,
                marginBottom: 4,
              },
            }}
          />
        </View>
      </ScrollView>

      {/* Floating Book Now Button */}
      {activity.batchData && activity.batchData.length > 0 && (
        <TouchableOpacity
          style={[
            styles.bookNowButton,
            isLoadingBrowser && styles.bookNowButtonDisabled,
          ]}
          onPress={async () => {
            const bookingUrl = `${frontendUrl}/booking/sports-booking/${activity.activity_id}`;

            navigate.navigate('WebView', {
              url: bookingUrl,
            });
          }}
          disabled={isLoadingBrowser}>
          {isLoadingBrowser ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.bookNowText}>Book Now</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fafafa',
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
  thumbnail: {
    width: '100%',
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  categoryBadge: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  shortDescription: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  descriptionContainer: {
    marginHorizontal: 16,
    marginBottom: 100,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  bookNowButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#007bff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bookNowButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookNowText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
  },
});

export default ActivityContainer;
