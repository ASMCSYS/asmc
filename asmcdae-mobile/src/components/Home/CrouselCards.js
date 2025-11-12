import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function CarouselCards({
  images = [],
  containerStyle = null,
  imageStyle = null,
  width = null,
  autoPlay = false,
  scrollAnimationDuration = 1000,
  autoPlayInterval = 3000,
}) {
  const {width: screenWidth} = Dimensions.get('window');
  const carouselWidth = width || screenWidth;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * carouselWidth,
          animated: true,
        });
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [currentIndex, autoPlay, autoPlayInterval, images.length, carouselWidth]);

  if (images && images.length === 0) {
    return null;
  }

  const handleScroll = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / carouselWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{width: carouselWidth}}
        contentContainerStyle={{width: carouselWidth * images.length}}>
        {images.map((item, index) => (
          <View key={index} style={[styles.card, {width: carouselWidth}]}>
            <Image
              source={{uri: item.image}}
              style={[styles.image, imageStyle]}
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? '#007AFF' : '#D1D1D6',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 14,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
