import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Text from '../../Text/Text';
import { colors } from '../../../assets/colors/colors';
import icons from '../../../assets/icons';
import Radio from '../../Radio/Radio';
import RadioFake from '../../Radio/RadioFake';
import Button from '../../Button/Button';

interface PayloadTypeSheet {
  currentVal: any;
  listRadio: {
    label: string;
    value: any;
    id?: string;
  }[];
  titleHeader: string;
}
const SelectRadioSheet = (props: SheetProps) => {
  const [currentVal, setCurrentVal] = React.useState<any>(null);
  const payload: PayloadTypeSheet = props.payload;
  const onPressSelect = (value: any) => {
    setCurrentVal(value);
  };
  const heightSheet = useMemo(() => {
    if (payload.listRadio.length > 0) {
      const currentH = payload.listRadio.length * 11;
      if (currentH < 30) {
        return '30%';
      }
      return `${currentH}%`;
    }
    return '30%';
  }, [payload.listRadio.length]);
  const onConfirmSelected = async () => {
    await SheetManager.hide(props.sheetId, {
      payload: currentVal,
    });
  };

  useEffect(() => {
    if (!payload.currentVal) {
      return;
    }
    setCurrentVal(payload.currentVal);
  }, [payload.currentVal]);

  return (
    <ActionSheet
      useBottomSafeAreaPadding={false}
      safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
      containerStyle={{
        height: heightSheet,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}>
      <View style={styles.header}>
        <Text fontFamily="NotoSans" bold fontSize={18}>
          {payload.titleHeader}
        </Text>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() =>
            SheetManager.hide(props.sheetId, {
              payload: payload.currentVal,
            })
          }>
          <Image source={icons.iconCloseBlack} style={styles.closeImg} />
        </TouchableOpacity>
      </View>
      <FlatList
        scrollIndicatorInsets={{ right: 1 }}
        data={payload.listRadio}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={<View style={{ height: 16 }} />}
        renderItem={({ item, index }) => {
          const isLast = index === payload.listRadio.length - 1;
          const isActive = currentVal?.value === item.value;
          return (
            <TouchableOpacity
              onPress={() => {
                onPressSelect(item);
              }}
              style={[
                styles.item,
                {
                  borderBottomWidth: isLast ? 0 : 1,
                },
              ]}>
              <Text>{item.label}</Text>
              <RadioFake value={isActive} />
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.footer}>
        <Button
          title="ตกลง"
          onPress={onConfirmSelected}
          disabled={!currentVal}
        />
      </View>
    </ActionSheet>
  );
};

export default SelectRadioSheet;

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.border1,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  closeImg: {
    width: 24,
    height: 24,
  },
  item: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: colors.border1,
    paddingRight: 16,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
