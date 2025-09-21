import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CartItem } from '@/types/product';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  itemName: {
    fontSize: 12,
    flex: 2,
  },
  itemQuantity: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#333333',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});

interface ReceiptPDFProps {
  items: CartItem[];
  total: number;
  orderId: string;
  timestamp: Date;
}

export const ReceiptPDF = ({ items, total, orderId, timestamp }: ReceiptPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Electronic Receipt</Text>
        <Text style={styles.subtitle}>Receipt Demo Store</Text>
        <Text style={styles.subtitle}>Order ID: {orderId}</Text>
        <Text style={styles.subtitle}>Date: {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemName, { fontWeight: 'bold' }]}>Item</Text>
          <Text style={[styles.itemQuantity, { fontWeight: 'bold' }]}>Qty</Text>
          <Text style={[styles.itemPrice, { fontWeight: 'bold' }]}>Amount</Text>
        </View>
        
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product.name}</Text>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.product.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Thank you for your purchase!</Text>
        <Text>This is a demo receipt - no actual payment was processed.</Text>
      </View>
    </Page>
  </Document>
);