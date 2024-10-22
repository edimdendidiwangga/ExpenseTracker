import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Popover from 'react-native-popover-view';

interface UserPopoverProps {
  onLogout: () => void;
  userRole: string | null;
}

const UserPopover: React.FC<UserPopoverProps> = ({ onLogout, userRole }) => {
  const [isVisible, setIsVisible] = useState(false);
  const touchableRef = useRef<TouchableOpacity>(null);

  return (
    <View style={styles.popoverContainer}>
      <TouchableOpacity
        ref={touchableRef}
        style={styles.userButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.userButtonText}>User</Text>
      </TouchableOpacity>

      <Popover
        isVisible={isVisible}
        from={touchableRef}
        onRequestClose={() => setIsVisible(false)}
        placement="bottom"
      >
        <View style={styles.popoverContent}>
          <Text style={styles.popoverItem}>User: {userRole}</Text>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.popoverItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  popoverContainer: {
    marginRight: 10,
  },
  userButton: {
    backgroundColor: '#1E3A8A',
    padding: 8,
    borderRadius: 5,
  },
  userButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  popoverContent: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  popoverItem: {
    paddingVertical: 5,
    color: '#1E3A8A',
    fontSize: 16,
  },
});

export default UserPopover;
