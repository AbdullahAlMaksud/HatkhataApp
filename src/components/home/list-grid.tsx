import BazaarListCard from '@/components/bazaar-list-card';
import React, { FC } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { BazaarList } from '@/types';

interface ListGridProps {
  lists: BazaarList[];
  currencySymbol: string;
  showTotalPrice: boolean;
  hapticEnabled: boolean;
  onTogglePin: (id: string, isPinned: boolean) => void;
}

const ListGrid: FC<ListGridProps> = ({
  lists,
  currencySymbol,
  showTotalPrice,
  hapticEnabled,
  onTogglePin,
}) => {
  const renderListItem = ({ item, index }: { item: BazaarList; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}>
      <BazaarListCard
        list={item}
        currencySymbol={currencySymbol}
        showTotalPrice={showTotalPrice}
        hapticEnabled={hapticEnabled}
        onLongPress={() => onTogglePin(item.id, item.isPinned)}
      />
    </View>
  );

  return (
    <FlatList
      data={lists}
      renderItem={renderListItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create((theme) => ({
  listContent: {
    paddingHorizontal: theme.gap(5),
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48.5%',
  },
  cardLeft: {
    marginRight: 4,
  },
  cardRight: {
    marginLeft: 4,
  },
}));

export default ListGrid;
