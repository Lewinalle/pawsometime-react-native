// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// import { DrawerActions } from '@react-navigation/routers';
// import Board from '../screens/Board/Board';
// import Settings from '../screens/Settings/Settings';

// const Drawer = createDrawerNavigator();

// function CustomDrawerContent(props) {
// 	return (
// 		<DrawerContentScrollView {...props}>
// 			<DrawerItemList {...props} />
// 			<DrawerItem label="Close drawer" onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())} />
// 			<DrawerItem label="Toggle drawer" onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())} />
// 		</DrawerContentScrollView>
// 	);
// }

// export default function MyDrawer() {
// 	return (
// 		<Drawer.Navigator drawerContent={(props) => CustomDrawerContent(props)}>
// 			<Drawer.Screen name="Board" component={Board} />
// 			<Drawer.Screen name="Settings" component={Settings} />
// 		</Drawer.Navigator>
// 	);
// }

// // export default function App() {
// // 	return (
// // 		<NavigationContainer>
// // 			<MyDrawer />
// // 		</NavigationContainer>
// // 	);
// // }
