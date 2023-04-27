import { KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import { useLocalization } from '../../contexts/LocalizationContext';
import SearchInput from '../../components/SearchInput/SearchInput';
import ListItem from './ListItem';
import CartBadge from '../../components/CartBadge/CartBadge';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { useDebounce } from '../../hook';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const StoreDetailScreen = ({
  navigation,
}: StackScreenProps<MainStackParamList, 'StoreDetailScreen'>) => {
  const {
    cartApi: { getCartList },
  } = useCart();
  const {
    state: { user },
  } = useAuth();

  const { t } = useLocalization();
  const [searchValue, setSearchValue] = React.useState<string | undefined>(
    undefined,
  );
  const [loadingApi, setLoadingApi] = React.useState<boolean>(false);
  const [debounceSearchValue, setDebounceSearchValue] = React.useState<
    string | undefined
  >('');
  const onSearch = (v: string | undefined) => {
    setDebounceSearchValue(v);
  };
  useEffect(() => {
    getCartList();
  }, [getCartList]);

  return (
    <Container>
      <Header
        title={t('screens.StoreDetailScreen.title')}
        componentRight={<CartBadge navigation={navigation} />}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Content
          style={{
            padding: 0,
            flex: 1,
            width: '100%',
          }}>
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <SearchInput
              value={searchValue}
              onChange={v => {
                setSearchValue(v);
              }}
              onSearch={onSearch}
              placeholder={t('screens.StoreDetailScreen.placeholder')}
            />
          </View>
          <ListItem
            navigation={navigation}
            setLoadingApi={setLoadingApi}
            debounceSearchValue={debounceSearchValue}
          />
        </Content>
      </KeyboardAvoidingView>
      <LoadingSpinner visible={loadingApi} />
    </Container>
  );
};

export default StoreDetailScreen;
