class ProductCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isExpanded !== this.props.isExpanded) {
      Animated.spring(this.animation, {
        toValue: this.props.isExpanded ? 1 : 0,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const { item, onPress, onBuy, isExpanded } = this.props;

    const rotateArrow = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const contentStyle = {
      opacity: this.animation,
      transform: [
        {
          translateY: this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
      ],
    };

    return (
      <View style={styles.cardContainer}>

        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.titleText}>{item.name}</Text>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>

            <View style={styles.rightColumn}>
              <Image source={item.Image} style={styles.image} />
              <Animated.Text style={[styles.arrow, { transform: [{ rotate: rotateArrow }] }]}>
                ▼
              </Animated.Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View style={[styles.expandedContainer, contentStyle]}>
            <Text style={styles.descriptionText}>
              {item.description}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.primaryButton}
              onPress={onBuy}
            >
              <Text style={styles.primaryButtonText}>Reservar cita</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

      </View>
    );
  }
}