import React from 'react';
import { StyleSheet, Text, View, TextInput, Platform, KeyboardAvoidingView, ImageBackground, StatusBar, ActivityIndicator } from 'react-native';

import getImageForWeather from './utils/getImageForWeather';
import SearchInput from './components/SearchInput';
import { fetchLocationId, fetchWeather } from './utils/api.js';

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			error: false,
			location: '',
			temperature: 0,
			weather: '',
		};
	}

	componentDidMount() {
		this.handleUpdateLocation('Tokyo');
	}

	handleUpdateLocation = async city => {
		if (!city) return;

		this.setState({ loading: true }, async () => {
			try {
				const locationId = await fetchLocationId(city);
				const { location, weather, temperature } = await fetchWeather(
					locationId,
				);
				
				this.setState({
					loading: false,
					error: false,
					location,
					weather,
					temperature,
				});
			} catch(e) {
				this.setState({
					loading: false,
					error: true,
				});
			}
		
		});

	};

	render() {
		const { loading, error, location, weather, temperature } = this.state;

		return(
			<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
				<StatusBar barstyle="light-content" />
				<ImageBackground
					source={getImageForWeather(weather)}
					style={styles.imageContainer}
					imageStyle={styles.image}
				>
					<View style={styles.detailsContainer}>
						<ActivityIndicator animating={loading} color="white" size="large" />
						{!loading && (
							<View>
								{error && (
									<Text style={[styles.smallText, styles.textStyle]}>
										Could not load weather, please try a different city.
									</Text>
								)}
								{!error && (
									<View>
										<Text style={[styles.largeText, styles.textStyle]}>
											{location}
										</Text>
										<Text style={[styles.smallText, styles.textStyle]}>
											{weather}
										</Text>
										<Text style={[styles.largeText, styles.textStyle]}>
											{`${Math.round(temperature)}°`}
										</Text>
									</View>
								)}
								
								<SearchInput
									placeholder="Search any city"
									onSubmit={this.handleUpdateLocation}
								/>
							</View>
						)}
					</View>
				</ImageBackground>
			</KeyboardAvoidingView>			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
 	 },
	textStyle: {
		textAlign: 'center',
		fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
		color: '#000000',
 	 },
	largeText: {
       	        fontSize: 44,
 	 },
	smallText: {
		fontSize: 18,
	},
	textInput: {
		backgroundColor: '#666',
		color: 'white',
		height: 40,
		width: 300,
		marginTop: 20,
		marginHorizontal: 20,
		paddingHorizontal: 10,
		alignSelf: 'center',
	},
	imageContainer: {
		flex: 1,
	},
	image: {
		flex: 1, 
		width: null,
		height: null,
		resizeMode: 'cover',
	},
	detailsContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.2)',
		paddingHorizontal: 20,
	},
});
