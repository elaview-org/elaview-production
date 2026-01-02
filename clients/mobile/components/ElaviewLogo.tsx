import Svg, { Path, Rect } from 'react-native-svg';

interface ElaviewLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ElaviewLogo({ 
  width = 218, 
  height = 52, 
  color = '#000000' 
}: ElaviewLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 218 52" fill="none">
      <Path d="M32.059 36.6664H55.3016L52.8972 43.4207H32.059V36.6664Z" fill={color} />
      <Rect x="32.059" y="7.71854" width="8.01471" height="28.9467" fill={color} />
      <Rect y="7.71854" width="27.25" height="6.75424" fill={color} />
      <Rect y="14.4734" width="8.01471" height="6.75424" fill={color} />
      <Rect y="28.9469" width="8.01471" height="7.71913" fill={color} />
      <Rect y="21.2281" width="24.0441" height="7.71913" fill={color} />
      <Rect y="36.6664" width="27.25" height="6.75424" fill={color} />
      <Rect x="141.059" y="7.71854" width="27.25" height="6.75424" fill={color} />
      <Rect x="141.059" y="14.4734" width="8.01471" height="6.75424" fill={color} />
      <Rect x="141.059" y="28.9469" width="8.01471" height="7.71913" fill={color} />
      <Rect x="141.059" y="21.2281" width="24.0441" height="7.71913" fill={color} />
      <Rect x="141.059" y="36.6664" width="27.25" height="6.75424" fill={color} />
      <Path d="M76.941 0V16.8856L65.7204 43.4201H57.7057L76.941 0Z" fill={color} />
      <Path d="M76.9415 16.4032V0L97.7797 43.4201H89.765L76.9415 16.4032Z" fill={color} />
      <Path d="M72.1323 27.4995H82.5514L85.7573 33.7713H69.7278L72.1323 27.4995Z" fill={color} />
      <Path d="M85.7575 7.71854H92.9708L105.794 33.2882V51.6211L85.7575 7.71854Z" fill={color} />
      <Path d="M116.213 7.71854H123.427L105.794 51.1386V33.2882L116.213 7.71854Z" fill={color} />
      <Rect x="128.235" y="7.71854" width="8.01471" height="35.701" fill={color} />
      <Path d="M173.118 7.71854H179.53L185.941 30.8759V43.4195H182.924L173.118 7.71854Z" fill={color} />
      <Path d="M192.353 7.71854H198.765L205.177 30.8759V43.4195H202.159L192.353 7.71854Z" fill={color} />
      <Path d="M198.765 7.71854H192.353L185.942 30.8759V43.4195H188.959L198.765 7.71854Z" fill={color} />
      <Path d="M218 7.71854H211.588L205.176 30.8759V43.4195H208.194L218 7.71854Z" fill={color} />
    </Svg>
  );
}